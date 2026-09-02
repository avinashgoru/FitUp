const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting deterministic seed for Phase 10...');

  // ---------------------------------------------------------
  // 1. SEED EXERCISES
  // ---------------------------------------------------------
  const exercises = [
    { slug: 'ex-pushup', name: 'Standard Pushup', description: 'Classic chest and triceps builder.', difficulty: 'INTERMEDIATE', equipment: 'BODYWEIGHT' },
    { slug: 'ex-squat', name: 'Bodyweight Squat', description: 'Fundamental lower body movement.', difficulty: 'BEGINNER', equipment: 'BODYWEIGHT' },
    { slug: 'ex-lunge', name: 'Walking Lunge', description: 'Unilateral leg strength and balance.', difficulty: 'INTERMEDIATE', equipment: 'BODYWEIGHT' },
    { slug: 'ex-plank', name: 'Forearm Plank', description: 'Core stabilization.', difficulty: 'BEGINNER', equipment: 'BODYWEIGHT' },
    { slug: 'ex-burpee', name: 'Burpee', description: 'Full body metabolic conditioning.', difficulty: 'ADVANCED', equipment: 'BODYWEIGHT' },
    { slug: 'ex-db-row', name: 'Dumbbell Row', description: 'Unilateral back and bicep builder.', difficulty: 'INTERMEDIATE', equipment: 'DUMBBELL' },
    { slug: 'ex-db-press', name: 'Dumbbell Overhead Press', description: 'Shoulder strength.', difficulty: 'INTERMEDIATE', equipment: 'DUMBBELL' },
    { slug: 'ex-kb-swing', name: 'Kettlebell Swing', description: 'Explosive hip hinge.', difficulty: 'ADVANCED', equipment: 'KETTLEBELL' },
    { slug: 'ex-jumping-jacks', name: 'Jumping Jacks', description: 'Warmup cardio.', difficulty: 'BEGINNER', equipment: 'BODYWEIGHT' },
    { slug: 'ex-cat-cow', name: 'Cat-Cow Stretch', description: 'Spinal mobility.', difficulty: 'BEGINNER', equipment: 'MAT' },
    { slug: 'ex-down-dog', name: 'Downward Dog', description: 'Full body stretch.', difficulty: 'BEGINNER', equipment: 'MAT' },
    { slug: 'ex-glute-bridge', name: 'Glute Bridge', description: 'Glute activation.', difficulty: 'BEGINNER', equipment: 'MAT' }
  ];

  console.log('Seeding Exercises...');
  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: ex,
      create: ex
    });
  }

  const dbExercises = await prisma.exercise.findMany();
  const getEx = (slug) => dbExercises.find(e => e.slug === slug).id;

  // ---------------------------------------------------------
  // 2. SEED WORKOUTS
  // ---------------------------------------------------------
  // Map deterministic profiles:
  // W1: GENERAL_FITNESS / BEGINNER / QUICK
  // W2: STRENGTH / INTERMEDIATE / BALANCED
  // W3: WEIGHT_MANAGEMENT / ADVANCED / DEDICATED
  // W4: MOBILITY / BEGINNER / BALANCED
  // W5: STRENGTH / BEGINNER / BALANCED
  // W6: GENERAL_FITNESS / INTERMEDIATE / QUICK
  // W7: WEIGHT_MANAGEMENT / BEGINNER / QUICK
  // W8: STRENGTH / ADVANCED / DEDICATED

  const workouts = [
    {
      slug: 'wk-full-body-starter',
      title: 'Full Body Starter',
      description: 'A quick, simple circuit to get your body moving and build basic strength.',
      durationMinutes: 15,
      difficulty: 'BEGINNER',
      goal: 'GENERAL_FITNESS',
      experienceLevel: 'BEGINNER',
      routinePreference: 'QUICK',
      exercises: [
        { exerciseId: getEx('ex-jumping-jacks'), order: 1, durationSecs: 60, restSecs: 15 },
        { exerciseId: getEx('ex-squat'), order: 2, sets: 3, reps: 10, restSecs: 30 },
        { exerciseId: getEx('ex-plank'), order: 3, sets: 3, durationSecs: 30, restSecs: 30 }
      ]
    },
    {
      slug: 'wk-db-strength-foundation',
      title: 'Dumbbell Strength Foundation',
      description: 'Build functional strength with basic dumbbell movements.',
      durationMinutes: 30,
      difficulty: 'INTERMEDIATE',
      goal: 'STRENGTH',
      experienceLevel: 'INTERMEDIATE',
      routinePreference: 'BALANCED',
      exercises: [
        { exerciseId: getEx('ex-db-press'), order: 1, sets: 4, reps: 8, restSecs: 60 },
        { exerciseId: getEx('ex-db-row'), order: 2, sets: 4, reps: 10, restSecs: 60 },
        { exerciseId: getEx('ex-lunge'), order: 3, sets: 3, reps: 12, restSecs: 45 },
        { exerciseId: getEx('ex-pushup'), order: 4, sets: 3, reps: 15, restSecs: 45 }
      ]
    },
    {
      slug: 'wk-metabolic-furnace',
      title: 'Metabolic Furnace',
      description: 'High intensity conditioning requiring focus and advanced capacity.',
      durationMinutes: 45,
      difficulty: 'ADVANCED',
      goal: 'WEIGHT_MANAGEMENT',
      experienceLevel: 'ADVANCED',
      routinePreference: 'DEDICATED',
      exercises: [
        { exerciseId: getEx('ex-burpee'), order: 1, sets: 5, durationSecs: 45, restSecs: 15 },
        { exerciseId: getEx('ex-kb-swing'), order: 2, sets: 5, durationSecs: 45, restSecs: 15 },
        { exerciseId: getEx('ex-squat'), order: 3, sets: 5, durationSecs: 45, restSecs: 15 },
        { exerciseId: getEx('ex-plank'), order: 4, sets: 3, durationSecs: 60, restSecs: 30 }
      ]
    },
    {
      slug: 'wk-morning-mobility',
      title: 'Morning Mobility',
      description: 'A gentle flow to wake up the spine and open the hips.',
      durationMinutes: 20,
      difficulty: 'BEGINNER',
      goal: 'MOBILITY',
      experienceLevel: 'BEGINNER',
      routinePreference: 'BALANCED',
      exercises: [
        { exerciseId: getEx('ex-cat-cow'), order: 1, sets: 2, durationSecs: 60, restSecs: 0 },
        { exerciseId: getEx('ex-down-dog'), order: 2, sets: 2, durationSecs: 45, restSecs: 15 },
        { exerciseId: getEx('ex-glute-bridge'), order: 3, sets: 2, reps: 10, restSecs: 30 }
      ]
    },
    {
      slug: 'wk-strength-101',
      title: 'Strength 101',
      description: 'Learn the fundamentals of body tension and resistance.',
      durationMinutes: 25,
      difficulty: 'BEGINNER',
      goal: 'STRENGTH',
      experienceLevel: 'BEGINNER',
      routinePreference: 'BALANCED',
      exercises: [
        { exerciseId: getEx('ex-glute-bridge'), order: 1, sets: 3, reps: 15, restSecs: 30 },
        { exerciseId: getEx('ex-squat'), order: 2, sets: 3, reps: 12, restSecs: 45 },
        { exerciseId: getEx('ex-pushup'), order: 3, sets: 3, reps: 5, restSecs: 60 } // Modifiable to knees based on instruction
      ]
    },
    {
      slug: 'wk-quick-sweat',
      title: 'Quick Sweat',
      description: 'Short on time? Get your heart rate up and feel energized.',
      durationMinutes: 12,
      difficulty: 'INTERMEDIATE',
      goal: 'GENERAL_FITNESS',
      experienceLevel: 'INTERMEDIATE',
      routinePreference: 'QUICK',
      exercises: [
        { exerciseId: getEx('ex-jumping-jacks'), order: 1, sets: 3, durationSecs: 40, restSecs: 20 },
        { exerciseId: getEx('ex-lunge'), order: 2, sets: 3, durationSecs: 40, restSecs: 20 },
        { exerciseId: getEx('ex-pushup'), order: 3, sets: 3, durationSecs: 40, restSecs: 20 }
      ]
    },
    {
      slug: 'wk-fat-loss-starter',
      title: 'Fat Loss Starter',
      description: 'An accessible interval routine to build stamina.',
      durationMinutes: 15,
      difficulty: 'BEGINNER',
      goal: 'WEIGHT_MANAGEMENT',
      experienceLevel: 'BEGINNER',
      routinePreference: 'QUICK',
      exercises: [
        { exerciseId: getEx('ex-squat'), order: 1, sets: 4, durationSecs: 30, restSecs: 30 },
        { exerciseId: getEx('ex-jumping-jacks'), order: 2, sets: 4, durationSecs: 30, restSecs: 30 }
      ]
    },
    {
      slug: 'wk-advanced-power',
      title: 'Advanced Power',
      description: 'Develop explosive strength and absolute power.',
      durationMinutes: 60,
      difficulty: 'ADVANCED',
      goal: 'STRENGTH',
      experienceLevel: 'ADVANCED',
      routinePreference: 'DEDICATED',
      exercises: [
        { exerciseId: getEx('ex-kb-swing'), order: 1, sets: 5, reps: 15, restSecs: 90 },
        { exerciseId: getEx('ex-db-press'), order: 2, sets: 5, reps: 5, restSecs: 120 },
        { exerciseId: getEx('ex-burpee'), order: 3, sets: 4, reps: 10, restSecs: 60 }
      ]
    }
  ];

  console.log('Seeding Workouts...');
  for (const w of workouts) {
    const { exercises: workoutExercises, ...workoutData } = w;
    
    // Upsert Workout
    const createdWorkout = await prisma.workout.upsert({
      where: { slug: workoutData.slug },
      update: workoutData,
      create: workoutData
    });

    // Clean existing associations to enforce idempotency
    await prisma.workoutExercise.deleteMany({
      where: { workoutId: createdWorkout.id }
    });

    // Create associations
    for (const we of workoutExercises) {
      await prisma.workoutExercise.create({
        data: {
          ...we,
          workoutId: createdWorkout.id
        }
      });
    }
  }

  // ---------------------------------------------------------
  // 3. SEED MEALS (PHASE 11)
  // ---------------------------------------------------------
  const meals = [
    {
      slug: 'ml-protein-oats',
      name: 'High-Protein Oatmeal',
      description: 'A quick, powerful start to the morning packed with sustained energy.',
      mealType: 'BREAKFAST',
      dietaryType: 'VEGETARIAN',
      calories: 450,
      protein: 30,
      carbohydrates: 55,
      fats: 12,
      preparationTimeMinutes: 10,
      servings: 1,
      instructions: '1. Cook oats with milk on medium heat.\\n2. Stir in protein powder once thickened.\\n3. Top with berries and seeds.',
      goals: ['STRENGTH', 'GENERAL_FITNESS'],
      ingredients: [
        { name: 'Rolled Oats', quantity: 0.5, unit: 'cup' },
        { name: 'Whey Protein', quantity: 1, unit: 'scoop' },
        { name: 'Mixed Berries', quantity: 0.5, unit: 'cup' }
      ]
    },
    {
      slug: 'ml-vegan-tofu-scramble',
      name: 'Tofu Scramble',
      description: 'A plant-based classic rich in protein and micronutrients.',
      mealType: 'BREAKFAST',
      dietaryType: 'VEGAN',
      calories: 320,
      protein: 22,
      carbohydrates: 15,
      fats: 18,
      preparationTimeMinutes: 15,
      servings: 1,
      instructions: '1. Crumble tofu into a pan.\\n2. Add turmeric and nutritional yeast.\\n3. Sauté with spinach and tomatoes.',
      goals: ['GENERAL_FITNESS', 'WEIGHT_MANAGEMENT'],
      ingredients: [
        { name: 'Firm Tofu', quantity: 150, unit: 'g' },
        { name: 'Spinach', quantity: 1, unit: 'cup' },
        { name: 'Nutritional Yeast', quantity: 2, unit: 'tbsp' }
      ]
    },
    {
      slug: 'ml-chicken-quinoa-bowl',
      name: 'Chicken & Quinoa Bowl',
      description: 'Balanced macronutrients perfect for midday recovery.',
      mealType: 'LUNCH',
      dietaryType: 'NON_VEGETARIAN',
      calories: 550,
      protein: 45,
      carbohydrates: 50,
      fats: 15,
      preparationTimeMinutes: 25,
      servings: 1,
      instructions: '1. Grill chicken breast.\\n2. Cook quinoa according to package.\\n3. Toss together with roasted vegetables.',
      goals: ['STRENGTH', 'ENDURANCE', 'GENERAL_FITNESS'],
      ingredients: [
        { name: 'Chicken Breast', quantity: 150, unit: 'g' },
        { name: 'Quinoa', quantity: 0.5, unit: 'cup dry' },
        { name: 'Mixed Veggies', quantity: 1, unit: 'cup' }
      ]
    },
    {
      slug: 'ml-salmon-sweet-potato',
      name: 'Salmon & Sweet Potato',
      description: 'High in Omega-3s and complex carbs for dinner.',
      mealType: 'DINNER',
      dietaryType: 'NON_VEGETARIAN',
      calories: 620,
      protein: 35,
      carbohydrates: 45,
      fats: 28,
      preparationTimeMinutes: 35,
      servings: 1,
      instructions: '1. Bake salmon at 400F for 15 mins.\\n2. Roast cubed sweet potatoes.\\n3. Serve with steamed asparagus.',
      goals: ['STRENGTH', 'GENERAL_FITNESS'],
      ingredients: [
        { name: 'Salmon Fillet', quantity: 150, unit: 'g' },
        { name: 'Sweet Potato', quantity: 200, unit: 'g' },
        { name: 'Asparagus', quantity: 100, unit: 'g' }
      ]
    },
    {
      slug: 'ml-vegan-lentil-stew',
      name: 'Hearty Lentil Stew',
      description: 'Warm, filling, and packed with plant-based fiber.',
      mealType: 'DINNER',
      dietaryType: 'VEGAN',
      calories: 410,
      protein: 20,
      carbohydrates: 65,
      fats: 8,
      preparationTimeMinutes: 45,
      servings: 4,
      instructions: '1. Sauté onions and carrots.\\n2. Add lentils and broth.\\n3. Simmer for 30 minutes.',
      goals: ['WEIGHT_MANAGEMENT', 'GENERAL_FITNESS'],
      ingredients: [
        { name: 'Green Lentils', quantity: 1, unit: 'cup dry' },
        { name: 'Vegetable Broth', quantity: 4, unit: 'cups' },
        { name: 'Carrots', quantity: 2, unit: 'medium' }
      ]
    },
    {
      slug: 'ml-greek-yogurt-parfait',
      name: 'Greek Yogurt Parfait',
      description: 'Quick protein-rich snack.',
      mealType: 'SNACK',
      dietaryType: 'VEGETARIAN',
      calories: 220,
      protein: 18,
      carbohydrates: 25,
      fats: 5,
      preparationTimeMinutes: 5,
      servings: 1,
      instructions: '1. Layer yogurt and berries.\\n2. Top with a sprinkle of granola.',
      goals: ['WEIGHT_MANAGEMENT'],
      ingredients: [
        { name: 'Greek Yogurt', quantity: 150, unit: 'g' },
        { name: 'Berries', quantity: 0.5, unit: 'cup' },
        { name: 'Granola', quantity: 2, unit: 'tbsp' }
      ]
    },
    {
      slug: 'ml-apple-almond-butter',
      name: 'Apple & Almond Butter',
      description: 'Simple energy boost.',
      mealType: 'SNACK',
      dietaryType: 'VEGAN',
      calories: 200,
      protein: 4,
      carbohydrates: 25,
      fats: 9,
      preparationTimeMinutes: 2,
      servings: 1,
      instructions: '1. Slice apple.\\n2. Serve with almond butter.',
      goals: ['GENERAL_FITNESS'],
      ingredients: [
        { name: 'Apple', quantity: 1, unit: 'medium' },
        { name: 'Almond Butter', quantity: 1, unit: 'tbsp' }
      ]
    }
  ];

  console.log('Seeding Meals...');
  for (const m of meals) {
    const { goals, ingredients, ...mealData } = m;
    
    // Clean old scaffold meal if it exists under same name (rare but safe)
    await prisma.meal.deleteMany({ where: { name: mealData.name }});
    
    const createdMeal = await prisma.meal.upsert({
      where: { slug: mealData.slug },
      update: mealData,
      create: mealData
    });

    // Clean relations
    await prisma.mealGoal.deleteMany({ where: { mealId: createdMeal.id } });
    await prisma.mealIngredient.deleteMany({ where: { mealId: createdMeal.id } });

    // Seed Goals
    for (const g of goals) {
      await prisma.mealGoal.create({
        data: { mealId: createdMeal.id, goal: g }
      });
    }

    // Seed Ingredients
    for (const ing of ingredients) {
      await prisma.mealIngredient.create({
        data: { ...ing, mealId: createdMeal.id }
      });
    }
  }

  // ---------------------------------------------------------
  // 4. SEED YOGA (PHASE 12)
  // ---------------------------------------------------------
  const yogaPoses = [
    { slug: 'yp-mountain', name: 'Mountain Pose', description: 'Foundation for all standing poses.', level: 'BEGINNER', style: 'HATHA', benefits: 'Improves posture and body awareness.', instructions: 'Stand tall with feet together, shoulders relaxed, arms at your sides.', durationSeconds: 30, imageUrl: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328062/b0eb873ea13dfc5e0746c56d89d01be8.jpg' },
    { slug: 'yp-downward-dog', name: 'Downward Dog', description: 'Classic inversion stretching the entire back body.', level: 'BEGINNER', style: 'VINYASA', benefits: 'Stretches hamstrings, calves, and spine.', instructions: 'Press hands into the floor, lift hips back and up.', durationSeconds: 60, imageUrl: null },
    { slug: 'yp-childs-pose', name: 'Child\'s Pose', description: 'Resting pose for centering and grounding.', level: 'BEGINNER', style: 'RESTORATIVE', benefits: 'Gently stretches hips and spine.', instructions: 'Kneel, sit back on your heels, and reach arms forward.', durationSeconds: 60, imageUrl: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328185/c898683ceb741a858a49065e9617c794.jpg' },
    { slug: 'yp-warrior-ii', name: 'Warrior II', description: 'Fierce standing pose building leg strength.', level: 'BEGINNER', style: 'HATHA', benefits: 'Strengthens legs and opens hips.', instructions: 'Step one foot back, turn it out, bend front knee deeply, arms parallel to floor.', durationSeconds: 45, imageUrl: null },
    { slug: 'yp-tree-pose', name: 'Tree Pose', description: 'Balancing pose improving focus.', level: 'BEGINNER', style: 'HATHA', benefits: 'Improves balance and strengthens ankles.', instructions: 'Place one foot on the inner thigh or calf of the standing leg.', durationSeconds: 45, imageUrl: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328305/58c149cfda4872a1f8f7b240de15f8a2.jpg' },
    { slug: 'yp-chaturanga', name: 'Chaturanga', description: 'Low plank transition pose.', level: 'INTERMEDIATE', style: 'VINYASA', benefits: 'Builds upper body and core strength.', instructions: 'Lower from high plank, keeping elbows close to ribs.', durationSeconds: 15, imageUrl: null },
    { slug: 'yp-upward-dog', name: 'Upward Dog', description: 'Heart-opening backbend.', level: 'INTERMEDIATE', style: 'VINYASA', benefits: 'Stretches the chest and strengthens the spine.', instructions: 'Press through hands, lift chest, keep thighs off the floor.', durationSeconds: 30, imageUrl: null },
    { slug: 'yp-pigeon', name: 'Pigeon Pose', description: 'Deep hip opener.', level: 'INTERMEDIATE', style: 'RESTORATIVE', benefits: 'Releases tension in the hips and glutes.', instructions: 'Bring one knee forward behind the wrist, extend the other leg back.', durationSeconds: 90, imageUrl: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328663/54ac62290e6b418201c671a5b685ba22.jpg' },
    { slug: 'yp-crow', name: 'Crow Pose', description: 'Arm balance requiring core strength.', level: 'ADVANCED', style: 'VINYASA', benefits: 'Strengthens arms, wrists, and core.', instructions: 'Place hands on floor, knees to triceps, lean forward until feet lift.', durationSeconds: 30, imageUrl: null },
    { slug: 'yp-corpse', name: 'Savasana', description: 'Final relaxation pose.', level: 'BEGINNER', style: 'RESTORATIVE', benefits: 'Calms the nervous system.', instructions: 'Lie flat on your back, arms at sides, palms up, completely relaxed.', durationSeconds: 180, imageUrl: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328748/3ebbcbc82b89d1d0777a1e89a172e64b.jpg' },
    { slug: 'yp-seated-forward-fold', name: 'Seated Forward Fold', description: 'Calming hamstring stretch.', level: 'BEGINNER', style: 'HATHA', benefits: 'Stretches hamstrings and lower back.', instructions: 'Sit with legs extended, reach forward towards your toes.', durationSeconds: 60, imageUrl: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328698/47ccbabce93f665df6370557c3391963.jpg' },
    { slug: 'yp-bridge', name: 'Bridge Pose', description: 'Gentle backbend.', level: 'BEGINNER', style: 'HATHA', benefits: 'Opens the chest and strengthens the back.', instructions: 'Lie on back, bend knees, press feet into floor and lift hips.', durationSeconds: 45, imageUrl: null },
    { slug: 'yp-boat', name: 'Boat Pose', description: 'Core activator.', level: 'INTERMEDIATE', style: 'HATHA', benefits: 'Strengthens the abdominals and hip flexors.', instructions: 'Sit on sit bones, lift legs and lean back slightly to form a V shape.', durationSeconds: 30, imageUrl: null },
    { slug: 'yp-camel', name: 'Camel Pose', description: 'Deep kneeling backbend.', level: 'INTERMEDIATE', style: 'HATHA', benefits: 'Opens the entire front of the body.', instructions: 'Kneel, reach back for your heels, and lift the chest.', durationSeconds: 30, imageUrl: null },
    { slug: 'yp-wheel', name: 'Wheel Pose', description: 'Advanced full backbend.', level: 'ADVANCED', style: 'VINYASA', benefits: 'Increases spinal flexibility and arm strength.', instructions: 'Lie on back, hands by ears, press up into a full arch.', durationSeconds: 30, imageUrl: null }
  ];

  console.log('Seeding Yoga Poses...');
  for (const pose of yogaPoses) {
    await prisma.yogaPose.upsert({
      where: { slug: pose.slug },
      update: pose,
      create: pose
    });
  }

  const dbPoses = await prisma.yogaPose.findMany();
  const getPose = (slug) => dbPoses.find(p => p.slug === slug).id;

  const yogaPractices = [
    {
      slug: 'yp-morning-mobility-flow',
      name: 'Morning Mobility Flow',
      description: 'A gentle awakening for your joints and spine to start the day with intention.',
      durationMinutes: 10,
      level: 'BEGINNER',
      style: 'MOBILITY',
      goal: 'MOBILITY',
      experienceLevel: 'BEGINNER',
      routinePreference: 'QUICK',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328062/b0eb873ea13dfc5e0746c56d89d01be8.jpg',
      introduction: 'This sequence is designed to shake off the stiffness of sleep. Move slowly and connect with your breath.',
      poses: [
        { poseId: getPose('yp-childs-pose'), order: 1, durationSeconds: 60, cue: 'Breathe deeply into your lower back.' },
        { poseId: getPose('yp-downward-dog'), order: 2, durationSeconds: 60, cue: 'Pedal out your feet.' },
        { poseId: getPose('yp-mountain'), order: 3, durationSeconds: 30, cue: 'Stand tall and set an intention.' },
        { poseId: getPose('yp-seated-forward-fold'), order: 4, durationSeconds: 60, cue: 'Fold gently from the hips.' },
        { poseId: getPose('yp-corpse'), order: 5, durationSeconds: 60, cue: 'Rest and absorb the practice.' }
      ]
    },
    {
      slug: 'yp-foundation-flow',
      name: 'Foundation Flow',
      description: 'Master the basics of a Vinyasa practice, focusing on alignment and breath.',
      durationMinutes: 15,
      level: 'BEGINNER',
      style: 'HATHA',
      goal: 'GENERAL_FITNESS',
      experienceLevel: 'BEGINNER',
      routinePreference: 'BALANCED',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328185/c898683ceb741a858a49065e9617c794.jpg',
      introduction: 'Perfect for building confidence. We will hold foundational poses to ensure proper alignment.',
      poses: [
        { poseId: getPose('yp-mountain'), order: 1, durationSeconds: 30, cue: 'Ground through all four corners of your feet.' },
        { poseId: getPose('yp-downward-dog'), order: 2, durationSeconds: 60, cue: 'Press firmly into your palms.' },
        { poseId: getPose('yp-warrior-ii'), order: 3, durationSeconds: 45, cue: 'Gaze over your front fingertips.' },
        { poseId: getPose('yp-tree-pose'), order: 4, durationSeconds: 45, cue: 'Find a focal point to maintain balance.' },
        { poseId: getPose('yp-bridge'), order: 5, durationSeconds: 45, cue: 'Lift your hips high.' },
        { poseId: getPose('yp-corpse'), order: 6, durationSeconds: 120, cue: 'Let go of all effort.' }
      ]
    },
    {
      slug: 'yp-strength-stability-flow',
      name: 'Strength & Stability Flow',
      description: 'A heat-building practice targeting the core, legs, and upper body.',
      durationMinutes: 20,
      level: 'INTERMEDIATE',
      style: 'VINYASA',
      goal: 'STRENGTH',
      experienceLevel: 'INTERMEDIATE',
      routinePreference: 'BALANCED',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328305/58c149cfda4872a1f8f7b240de15f8a2.jpg',
      introduction: 'Prepare to sweat. This flow connects movement to breath while demanding physical endurance.',
      poses: [
        { poseId: getPose('yp-downward-dog'), order: 1, durationSeconds: 60, cue: 'Find your strong base.' },
        { poseId: getPose('yp-chaturanga'), order: 2, durationSeconds: 15, cue: 'Hover strongly.' },
        { poseId: getPose('yp-upward-dog'), order: 3, durationSeconds: 30, cue: 'Open your chest wide.' },
        { poseId: getPose('yp-downward-dog'), order: 4, durationSeconds: 30, cue: 'Push back and breathe.' },
        { poseId: getPose('yp-warrior-ii'), order: 5, durationSeconds: 60, cue: 'Sink deep into the front knee.' },
        { poseId: getPose('yp-boat'), order: 6, durationSeconds: 45, cue: 'Engage your core.' },
        { poseId: getPose('yp-corpse'), order: 7, durationSeconds: 180, cue: 'Release entirely.' }
      ]
    },
    {
      slug: 'yp-calm-evening-reset',
      name: 'Calm Evening Reset',
      description: 'A restorative sequence to down-regulate your nervous system before sleep.',
      durationMinutes: 15,
      level: 'BEGINNER',
      style: 'RESTORATIVE',
      goal: 'WEIGHT_MANAGEMENT',
      experienceLevel: 'BEGINNER',
      routinePreference: 'DEDICATED',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328663/54ac62290e6b418201c671a5b685ba22.jpg',
      introduction: 'Leave the day behind. We will hold poses longer to encourage deep tissue release.',
      poses: [
        { poseId: getPose('yp-childs-pose'), order: 1, durationSeconds: 120, cue: 'Surrender your weight.' },
        { poseId: getPose('yp-seated-forward-fold'), order: 2, durationSeconds: 90, cue: 'Soften your neck.' },
        { poseId: getPose('yp-pigeon'), order: 3, durationSeconds: 90, cue: 'Breathe into any tightness.' },
        { poseId: getPose('yp-bridge'), order: 4, durationSeconds: 60, cue: 'A gentle lift.' },
        { poseId: getPose('yp-corpse'), order: 5, durationSeconds: 240, cue: 'Complete stillness.' }
      ]
    },
    {
      slug: 'yp-mindful-balance',
      name: 'Mindful Balance',
      description: 'Challenge your equilibrium and sharpen your mental focus.',
      durationMinutes: 12,
      level: 'INTERMEDIATE',
      style: 'MINDFULNESS',
      goal: 'GENERAL_FITNESS',
      experienceLevel: 'INTERMEDIATE',
      routinePreference: 'QUICK',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328698/47ccbabce93f665df6370557c3391963.jpg',
      introduction: 'Balance poses require both physical strength and mental clarity.',
      poses: [
        { poseId: getPose('yp-mountain'), order: 1, durationSeconds: 30, cue: 'Feel the earth beneath you.' },
        { poseId: getPose('yp-tree-pose'), order: 2, durationSeconds: 60, cue: 'Root down to rise up.' },
        { poseId: getPose('yp-warrior-ii'), order: 3, durationSeconds: 45, cue: 'Strong and steady.' },
        { poseId: getPose('yp-boat'), order: 4, durationSeconds: 45, cue: 'Find your center of gravity.' },
        { poseId: getPose('yp-corpse'), order: 5, durationSeconds: 120, cue: 'Rest.' }
      ]
    },
    {
      slug: 'yp-full-body-invigoration',
      name: 'Full Body Invigoration',
      description: 'An advanced sequence demanding absolute focus, strength, and flexibility.',
      durationMinutes: 25,
      level: 'ADVANCED',
      style: 'VINYASA',
      goal: 'STRENGTH',
      experienceLevel: 'ADVANCED',
      routinePreference: 'DEDICATED',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328748/3ebbcbc82b89d1d0777a1e89a172e64b.jpg',
      introduction: 'This practice will push your boundaries. Respect your body\'s limits.',
      poses: [
        { poseId: getPose('yp-downward-dog'), order: 1, durationSeconds: 60, cue: 'Prepare your body.' },
        { poseId: getPose('yp-chaturanga'), order: 2, durationSeconds: 20, cue: 'Strong core.' },
        { poseId: getPose('yp-upward-dog'), order: 3, durationSeconds: 30, cue: 'Lift high.' },
        { poseId: getPose('yp-crow'), order: 4, durationSeconds: 45, cue: 'Trust your hands.' },
        { poseId: getPose('yp-camel'), order: 5, durationSeconds: 45, cue: 'Breathe into the chest.' },
        { poseId: getPose('yp-wheel'), order: 6, durationSeconds: 45, cue: 'Full expression.' },
        { poseId: getPose('yp-corpse'), order: 7, durationSeconds: 240, cue: 'Earned rest.' }
      ]
    },
    {
      slug: 'yp-core-vitality',
      name: 'Core Vitality',
      description: 'Fire up the powerhouse of your body with intense abdominal focus.',
      durationMinutes: 15,
      level: 'INTERMEDIATE',
      style: 'VINYASA',
      goal: 'WEIGHT_MANAGEMENT',
      experienceLevel: 'INTERMEDIATE',
      routinePreference: 'QUICK',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328185/c898683ceb741a858a49065e9617c794.jpg',
      introduction: 'A strong core supports every movement. Let\'s build the fire.',
      poses: [
        { poseId: getPose('yp-mountain'), order: 1, durationSeconds: 30, cue: 'Engage the belly.' },
        { poseId: getPose('yp-boat'), order: 2, durationSeconds: 60, cue: 'Lift the chest, keep the spine long.' },
        { poseId: getPose('yp-chaturanga'), order: 3, durationSeconds: 30, cue: 'Hold the hover.' },
        { poseId: getPose('yp-upward-dog'), order: 4, durationSeconds: 30, cue: 'Stretch the abdominals.' },
        { poseId: getPose('yp-corpse'), order: 5, durationSeconds: 120, cue: 'Relax completely.' }
      ]
    },
    {
      slug: 'yp-deep-release',
      name: 'Deep Release',
      description: 'Unlock tight hips and shoulders with long holds.',
      durationMinutes: 20,
      level: 'BEGINNER',
      style: 'RESTORATIVE',
      goal: 'MOBILITY',
      experienceLevel: 'ADVANCED',
      routinePreference: 'BALANCED',
      coverImage: 'https://res.cloudinary.com/dikdrwvpv/image/upload/v1788328305/58c149cfda4872a1f8f7b240de15f8a2.jpg',
      introduction: 'Breathe into the spaces that feel stuck. Patience is key here.',
      poses: [
        { poseId: getPose('yp-childs-pose'), order: 1, durationSeconds: 90, cue: 'Settle in.' },
        { poseId: getPose('yp-downward-dog'), order: 2, durationSeconds: 60, cue: 'Stretch it out.' },
        { poseId: getPose('yp-pigeon'), order: 3, durationSeconds: 120, cue: 'Melt forward.' },
        { poseId: getPose('yp-seated-forward-fold'), order: 4, durationSeconds: 90, cue: 'Release the lower back.' },
        { poseId: getPose('yp-corpse'), order: 5, durationSeconds: 180, cue: 'Absorb the release.' }
      ]
    }
  ];

  console.log('Seeding Yoga Practices...');
  for (const practice of yogaPractices) {
    const { poses, ...practiceData } = practice;
    
    // Upsert practice
    const createdPractice = await prisma.yogaPractice.upsert({
      where: { slug: practiceData.slug },
      update: practiceData,
      create: practiceData
    });

    // Clean existing associations to enforce idempotency
    await prisma.yogaPracticePose.deleteMany({
      where: { practiceId: createdPractice.id }
    });

    // Create associations
    for (const pose of poses) {
      await prisma.yogaPracticePose.create({
        data: {
          ...pose,
          practiceId: createdPractice.id
        }
      });
    }
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
