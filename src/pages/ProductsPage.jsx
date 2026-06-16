import { useNavigate } from 'react-router-dom'
import ProductsSection from '../sections/ProductsSection.jsx'

export default function ProductsPage({
  categories,
  filteredProducts,
  productAverageRating,
  selectedCategory,
  setSelectedCategory,
  handleAddToCart,
  setReviewForm,
}) {
  const navigate = useNavigate()

  const handleNavigate = (section) => {
    if (section === 'reviews') {
      navigate('/#reviews')
    } else if (section === 'home') {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#fff7e6]">
      <ProductsSection
        categories={categories}
        filteredProducts={filteredProducts}
        productAverageRating={productAverageRating}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleAddToCart={handleAddToCart}
        handleNavigate={handleNavigate}
        setReviewForm={setReviewForm}
      />
    </div>
  )
}
