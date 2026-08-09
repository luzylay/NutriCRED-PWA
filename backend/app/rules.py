# Rules Engine for Yanapiri Wawa
# Based on WHO Child Growth Standards (Weight-for-age) and UNICEF/WHO MUAC guidelines.

# Approximate WHO weight-for-age tables (months: (median_weight_kg, standard_deviation))
BOYS_WEIGHT_STATS = {
    0: (3.3, 0.4),
    3: (6.4, 0.7),
    6: (7.9, 0.8),
    9: (8.9, 0.9),
    12: (9.6, 1.0),
    15: (10.3, 1.1),
    18: (10.9, 1.1),
    21: (11.5, 1.2),
    24: (12.2, 1.2),
    30: (13.3, 1.4),
    36: (14.3, 1.5),
    42: (15.3, 1.7),
    48: (16.3, 1.8),
    54: (17.3, 2.0),
    60: (18.3, 2.1),
}

GIRLS_WEIGHT_STATS = {
    0: (3.2, 0.4),
    3: (5.8, 0.6),
    6: (7.3, 0.8),
    9: (8.2, 0.9),
    12: (8.9, 1.0),
    15: (9.5, 1.0),
    18: (10.2, 1.1),
    21: (10.9, 1.1),
    24: (11.5, 1.2),
    30: (12.7, 1.3),
    36: (13.9, 1.5),
    42: (15.0, 1.6),
    48: (15.5, 1.8),
    54: (16.8, 1.9),
    60: (18.2, 2.1),
}


def get_stats_for_age(age_months: int, sex: str):
    """
    Interpolate WHO median and standard deviation for a given age in months.
    """
    stats_dict = BOYS_WEIGHT_STATS if sex.upper() == "M" else GIRLS_WEIGHT_STATS
    ages = sorted(stats_dict.keys())

    if age_months <= ages[0]:
        return stats_dict[ages[0]]
    if age_months >= ages[-1]:
        return stats_dict[ages[-1]]

    # Find surrounding keys for interpolation
    for i in range(len(ages) - 1):
        age_low = ages[i]
        age_high = ages[i + 1]
        if age_low <= age_months <= age_high:
            weight_low, sd_low = stats_dict[age_low]
            weight_high, sd_high = stats_dict[age_high]

            # Linear interpolation
            ratio = (age_months - age_low) / (age_high - age_low)
            median = weight_low + ratio * (weight_high - weight_low)
            sd = sd_low + ratio * (sd_high - sd_low)
            return median, sd

    return stats_dict[ages[-1]]


def calculate_z_score(weight: float, age_months: int, sex: str) -> float:
    """
    Calculate Z-score for Weight-for-Age using linear interpolation of WHO tables.
    """
    median, sd = get_stats_for_age(age_months, sex)
    z_score = (weight - median) / sd
    return round(z_score, 2)


def evaluate_measurement(
    measurement_type: str, value: float, age_months: int, sex: str
):
    """
    Evaluate a measurement and determine its risk level.
    Returns (level, description, rule_name, rule_source).
    Levels: 'normal' (green), 'follow-up' (yellow), 'urgent' (red)

    CRITICAL CLINICAL PRINCIPLE: Never diagnose. Suggest follow-up or professional evaluation.
    """
    rule_name = "WHO Growth Standards Evaluation"
    rule_source = "WHO Child Growth Standards / MINSA CRED Technical Standard NTS 137"

    if measurement_type == "weight":
        z_score = calculate_z_score(value, age_months, sex)
        if z_score < -3.0:
            return (
                "urgent",
                f"El peso registrado ({value} kg) tiene una desviación crítica (Z = {z_score}). Requiere evaluación clínica presencial prioritaria para descartar desnutrición severa.",
                rule_name,
                rule_source,
            )
        elif z_score < -2.0:
            return (
                "follow-up",
                f"El peso registrado ({value} kg) muestra una desviación moderada (Z = {z_score}). Se sugiere visita domiciliaria de actor social y orientación nutricional.",
                rule_name,
                rule_source,
            )
        else:
            return (
                "normal",
                f"El peso registrado ({value} kg) se encuentra dentro de los parámetros esperados para su edad (Z = {z_score}).",
                rule_name,
                rule_source,
            )

    elif measurement_type == "muac":
        rule_name = "UNICEF Family-MUAC protocol"
        rule_source = "UNICEF / WHO MUAC reference card for infants aged 6-59 months"
        # MUAC is only evaluated for age >= 6 months and < 60 months
        if age_months < 6:
            return (
                "normal",
                "El perímetro braquial (MUAC) no está estandarizado para lactantes menores de 6 meses en el hogar.",
                rule_name,
                rule_source,
            )

        if value < 11.5:
            return (
                "urgent",
                f"Perímetro braquial (MUAC) de {value} cm se encuentra en la zona roja (< 11.5 cm). Requiere evaluación clínica inmediata para evaluar estado nutricional agudo.",
                rule_name,
                rule_source,
            )
        elif value < 12.5:
            return (
                "follow-up",
                f"Perímetro braquial (MUAC) de {value} cm se encuentra en la zona amarilla (11.5 - 12.5 cm). Requiere visita de seguimiento y consejería.",
                rule_name,
                rule_source,
            )
        else:
            return (
                "normal",
                f"Perímetro braquial (MUAC) de {value} cm se encuentra en rango normal (> 12.5 cm).",
                rule_name,
                rule_source,
            )

    elif measurement_type == "height":
        # Height evaluation (Talla/longitud-para-edad)
        # Simplified validation range
        median_height = 50.0 + (age_months * 1.2)  # Simple mock line
        diff = value - median_height
        if diff < -10.0:
            return (
                "follow-up",
                f"La talla registrada ({value} cm) se encuentra por debajo de la media para su edad. Se sugiere revisión en la próxima visita CRED.",
                "WHO Height-for-Age Guidelines",
                "WHO Growth Standards / MINSA CRED",
            )
        else:
            return (
                "normal",
                f"La talla registrada ({value} cm) es normal para su edad.",
                "WHO Height-for-Age Guidelines",
                "WHO Growth Standards / MINSA CRED",
            )

    return (
        "normal",
        "Medición registrada correctamente.",
        "Default Validation",
        "System Config",
    )
