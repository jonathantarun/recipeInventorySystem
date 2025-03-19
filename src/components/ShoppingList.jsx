import React, { useState, useEffect } from 'react'
import { db } from '../firebase-config'
import { collection, query, onSnapshot } from 'firebase/firestore'

function ShoppingList() {
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'pantry'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setIngredients(items)
    })
    return () => unsubscribe()
  }, [])

  // For this example, consider an item needing replenishment if quantity is less than 1.
  const shoppingItems = ingredients.filter((item) => item.quantity < 5)

  return (
    <div>
      <h2>Shopping List</h2>
      {shoppingItems.length > 0 ? (
        <ul>
          {shoppingItems.map((item) => (
            <li key={item.id}>
              {item.name} is low. Please replenish.
            </li>
          ))}
        </ul>
      ) : (
        <p>Your pantry is well stocked!</p>
      )}
    </div>
  )
}

export default ShoppingList
