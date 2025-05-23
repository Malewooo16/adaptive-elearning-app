
const bktParamsIntroToExpressions = {
    "Intro to Expressions": {
      "Introduction to Variables": {
        "P_L0": 0.5,   // Moderate initial knowledge
        "P_T": 0.1,    // Moderate learning rate
        "P_G": 0.2,    // Moderate guessing probability
        "P_S": 0.1     // Low slip probability
      },
      "Substitution and Evaluating Expressions": {
        "P_L0": 0.3,   // Lower initial knowledge
        "P_T": 0.12,   // slightly higher learning rate due to the application of prior knowledge.
        "P_G": 0.25,  // Slightly higher guessing probability
        "P_S": 0.15    // Slightly higher slip probability
      },
      "Combining Like Terms": {
        "P_L0": 0.2,   // Lower initial knowledge
        "P_T": 0.1,    // Moderate learning rate
        "P_G": 0.15,  // Lower guessing probability
        "P_S": 0.2     // Higher slip probability
      },
      "Distributive Property & Simplification": {
        "P_L0": 0.1,   // Low initial knowledge
        "P_T": 0.08,   // Slightly lower learning rate
        "P_G": 0.1,   // Lower guessing probability
        "P_S": 0.25    // Higher slip probability
      }
    }
  };

  const bktParamsPolynomials = {
    "Polynomials": {
      "Introduction to Polynomials": {
        "P_L0": 0.4,   // Moderate initial knowledge
        "P_T": 0.11,   // Moderate learning rate
        "P_G": 0.2,    // Moderate guessing probability
        "P_S": 0.12    // Low slip probability
      },
      "Polynomial Operations": {
        "P_L0": 0.25,  // Lower initial knowledge
        "P_T": 0.1,    // Moderate learning rate
        "P_G": 0.18,   // Slightly lower guessing probability
        "P_S": 0.18    // Slightly higher slip probability
      },
      "Factoring Polynomials": {
        "P_L0": 0.15,  // Low initial knowledge
        "P_T": 0.09,   // Slightly lower learning rate
        "P_G": 0.12,   // Lower guessing probability
        "P_S": 0.22    // Higher slip probability
      },
      "Applications of Polynomials": {
        "P_L0": 0.1,   // Very low initial knowledge
        "P_T": 0.08,   // Lower learning rate
        "P_G": 0.1,    // Very low guessing probability
        "P_S": 0.25    // High slip probability
      }
    }
  };

  const bktParamsQuadratic = {
    "Quadratic Equations": {
      "Introduction to Quadratic Equations": {
        "P_L0": 0.45,  // Moderate initial knowledge
        "P_T": 0.11,   // Moderate learning rate
        "P_G": 0.2,    // Moderate guessing probability
        "P_S": 0.13    // Low slip probability
      },
      "Solving Quadratic Equations": {
        "P_L0": 0.25,  // Lower initial knowledge
        "P_T": 0.1,    // Moderate learning rate
        "P_G": 0.18,   // Slightly lower guessing probability
        "P_S": 0.2     // Slightly higher slip probability
      },
      "Nature of Roots": {
        "P_L0": 0.18,  // Low initial knowledge
        "P_T": 0.09,   // Slightly lower learning rate
        "P_G": 0.15,   // Lower guessing probability
        "P_S": 0.22    // Higher slip probability
      },
      "Applications of Quadratic Equations": {
        "P_L0": 0.1,   // Very low initial knowledge
        "P_T": 0.08,   // Lower learning rate
        "P_G": 0.1,    // Very low guessing probability
        "P_S": 0.25    // High slip probability
      }
    }
  };
  const bktParamsLinearEquations = {
    "Linear Equations": {
      "One-step Equations": {
        "P_L0": 0.6,   // High initial knowledge
        "P_T": 0.12,   // Moderate learning rate
        "P_G": 0.2,    // Moderate guessing probability
        "P_S": 0.1     // Low slip probability
      },
      "Two-step Equations": {
        "P_L0": 0.4,   // Moderate initial knowledge
        "P_T": 0.11,   // Moderate learning rate
        "P_G": 0.18,   // Slightly lower guessing probability
        "P_S": 0.15    // Slightly higher slip probability
      },
      "Multi-step Equations": {
        "P_L0": 0.25,  // Lower initial knowledge
        "P_T": 0.1,    // Moderate learning rate
        "P_G": 0.15,   // Lower guessing probability
        "P_S": 0.2     // Higher slip probability
      },
      "Word Problems Involving Linear Equations": {
        "P_L0": 0.15,  // Very low initial knowledge
        "P_T": 0.08,   // Lower learning rate
        "P_G": 0.1,    // Very low guessing probability
        "P_S": 0.25    // High slip probability
      }
    }
  };
  const bktParamsSystemOfEquations = {
    "System of Equations": {
      "Solving Systems of Equations: Substitution Method": {
        "P_L0": 0.4,   // Moderate initial knowledge
        "P_T": 0.11,   // Moderate learning rate
        "P_G": 0.2,    // Moderate guessing probability
        "P_S": 0.15    // Slightly higher slip probability
      },
      "Solving Systems of Equations: Elimination Method": {
        "P_L0": 0.3,   // Slightly lower initial knowledge
        "P_T": 0.1,    // Moderate learning rate
        "P_G": 0.18,   // Slightly lower guessing probability
        "P_S": 0.2     // Higher slip probability
      },
      "Graphical Method for Solving Systems of Equations": {
        "P_L0": 0.2,   // Lower initial knowledge
        "P_T": 0.09,   // Slightly lower learning rate
        "P_G": 0.15,   // Lower guessing probability
        "P_S": 0.22    // Higher slip probability
      },
      "Real-World Applications of Systems of Equations": {
        "P_L0": 0.1,   // Very low initial knowledge
        "P_T": 0.08,   // Lower learning rate
        "P_G": 0.1,    // Very low guessing probability
        "P_S": 0.25    // High slip probability
      }
    }
  };
  