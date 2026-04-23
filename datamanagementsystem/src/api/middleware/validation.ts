import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    username: Joi.string().required().min(3),
    password: Joi.string().required().min(6),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.details[0].message,
        code: 'VALIDATION_ERROR',
      },
    });
  }

  next();
}

export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(6).max(100),
    email: Joi.string().email().required(),
    role: Joi.string().valid('staff', 'pos', 'manager').default('staff'),
    fullName: Joi.string().max(100),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.details[0].message,
        code: 'VALIDATION_ERROR',
      },
    });
  }

  next();
}
