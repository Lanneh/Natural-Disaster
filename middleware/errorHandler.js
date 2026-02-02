module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: err.message 
    });
  }
  
  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  // Default error
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
};
```

---

## **Benefits of This Structure:**

✅ **Organized** - Easy to find and edit endpoints  
✅ **Scalable** - Add new routes/controllers easily  
✅ **Maintainable** - Each file has one responsibility  
✅ **Testable** - Can test controllers independently  
✅ **Clean** - No 500-line files  

---

## **New Endpoint URLs:**
```
Maps:
  GET  /api/maps/recent
  GET  /api/maps/most-played
  GET  /api/maps/highest-rated
  GET  /api/maps/search?query=...
  GET  /api/maps/:id
  POST /api/maps
  PATCH /api/maps/:id
  DELETE /api/maps/:id

Rating:
  PATCH /api/rating/:id          (set rating)
  DELETE /api/rating/:id         (remove rating)
  GET  /api/rating/list          (all rated maps)
  GET  /api/rating/:tier         (maps by tier)

Featuring:
  PATCH /api/featuring/:id       (feature map)
  DELETE /api/featuring/:id      (unfeature map)
  GET  /api/featuring/list       (featured list)

Stats:
  PATCH /api/stats/:id           (update stats)