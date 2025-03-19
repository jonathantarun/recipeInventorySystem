# Recipe Suggestion App

## Overview
Recipe Suggestion App is a web application that allows users to manage their pantry inventory by adding, updating, and tracking ingredients. The application integrates with Firebase Firestore to store pantry data in real-time, ensuring a seamless experience.

## Features
- **Add Ingredients**: Users can add ingredients with specified quantities.
- **Update Quantities**: If an ingredient already exists, its quantity is updated instead of creating a duplicate.
- **Real-time Sync**: Pantry items are updated in real-time using Firestore.
- **Data Normalization**: Ingredient names are stored in lowercase and trimmed to prevent duplicates due to case differences.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: (Optional) Firebase Authentication can be integrated

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/jonathantarun/recipeInventorySystem.git
   cd recipeInventorySystem
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a Firestore database.
   - Obtain Firebase configuration keys and update `firebase-config.js`.
4. Start the development server:
   ```bash
   npm run dev
   ```

   Or use this link to check out the [deployed website]().

## Firestore Data Structure
### Collection: `pantry`
Each document in the `pantry` collection represents an ingredient:
```json
{
  "name": "eggs",
  "quantity": 10
}
```
### Collection: `recipes`
Each document in the `recipes` collection represents an dish:
```json
{
  "name": "Chicken Noodles",
  "ingredients" : { name : "Chicken", quantity : 1
}
```

## Usage
1. Enter an ingredient name and quantity.
2. Click "Add Ingredient" to add/update the item.
3. The pantry list updates in real-time.
4. Use the `Add Recipe` Tab to add new recipes.
5. Check the "Shopping List" to see if your pantry is running out of any ingredient.
6. Click on "Make Recipe" in the `Recipe Suggestions` tab to create a dish - this will use up the number of ingredients specified (deleting the same number of ingredients in the database).

## Future Improvements
- Add user authentication for personalized pantry management.
- Implement categories for better ingredient organization.

## License
This project is open-source under the [MIT License](LICENSE).

