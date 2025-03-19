import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import PantryManager from './components/PantryManager'
import RecipeSuggestions from './components/RecipeSuggestions'
import ShoppingList from './components/ShoppingList'
import AddRecipe from './components/AddRecipe'

function App() {
  const [view, setView] = useState('dashboard')

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('pantry')}>Pantry</button>
        <button onClick={() => setView('recipes')}>Recipes</button>
        <button onClick={() => setView('shopping')}>Shopping List</button>
        <button onClick={() => setView('addRecipe')}>Add Recipe</button>
      </nav>
      <div style={{ padding: '1rem' }}>
        {view === 'dashboard' && <Dashboard />}
        {view === 'pantry' && <PantryManager />}
        {view === 'recipes' && <RecipeSuggestions />}
        {view === 'shopping' && <ShoppingList />}
        {view === 'addRecipe' && <AddRecipe />}
      </div>
    </div>
  )
}

export default App
