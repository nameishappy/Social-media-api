// utils/validation.js

import { body, validationResult } from "express-validator";

// Validation rules for user registration
export const registrationValidationRules = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  // Add more validation rules as needed
];

// Function to validate input data against defined validation rules
export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // Proceed to the next middleware if validation passes
};
