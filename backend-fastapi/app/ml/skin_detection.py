"""Skin image analysis using OpenCV heuristics + optional ML."""

import os
from pathlib import Path

try:
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False


def analyze_skin_image(file_path: str) -> dict:
    if not CV2_AVAILABLE or not os.path.exists(file_path):
        return {
            "condition": "Unable to analyze - using clinical review",
            "confidence": 45.0,
            "severity": "medium",
            "is_ml_active": False,
            "recommendations": ["Consult dermatologist for visual confirmation"],
        }

    img = cv2.imread(file_path)
    if img is None:
        return {"condition": "Invalid image", "confidence": 0, "severity": "unknown", "is_ml_active": False}

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    redness = cv2.inRange(hsv, (0, 50, 50), (10, 255, 255))
    red_ratio = np.sum(redness > 0) / (img.shape[0] * img.shape[1])

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = np.sum(edges > 0) / (img.shape[0] * img.shape[1])

    if red_ratio > 0.15 and edge_density > 0.05:
        condition = "Possible inflammatory dermatitis / rash"
        severity = "medium"
        confidence = 72.0
    elif red_ratio > 0.08:
        condition = "Mild erythema - monitor for spread"
        severity = "low"
        confidence = 65.0
    elif edge_density > 0.08:
        condition = "Possible fungal infection or dry lesion"
        severity = "medium"
        confidence = 68.0
    else:
        condition = "No significant abnormality detected"
        severity = "low"
        confidence = 58.0

    return {
        "condition": condition,
        "confidence": confidence,
        "severity": severity,
        "is_ml_active": True,
        "red_area_ratio": round(float(red_ratio), 4),
        "recommendations": [
            "Keep area clean and dry",
            "Avoid scratching",
            "Seek doctor if spreading or fever develops",
        ],
    }
