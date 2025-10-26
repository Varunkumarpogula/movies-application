// src/utils/dataManager.js
class DataManager {
  static getFavorites() {
    try {
      const favorites = localStorage.getItem('movieAppFavorites')
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Error getting favorites:', error)
      return []
    }
  }

  static saveFavorites(favorites) {
    try {
      localStorage.setItem('movieAppFavorites', JSON.stringify(favorites))
      return true
    } catch (error) {
      console.error('Error saving favorites:', error)
      return false
    }
  }

  static getRecentMovies() {
    try {
      const recent = localStorage.getItem('movieAppRecent')
      return recent ? JSON.parse(recent) : []
    } catch (error) {
      console.error('Error getting recent movies:', error)
      return []
    }
  }

  static saveRecentMovies(recentMovies) {
    try {
      localStorage.setItem('movieAppRecent', JSON.stringify(recentMovies))
      return true
    } catch (error) {
      console.error('Error saving recent movies:', error)
      return false
    }
  }
}

export default DataManager