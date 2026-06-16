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
    <div className="min-h-screen bg-[#4C2600] bg-[radial-gradient(circle_at_top_left,rgba(255,218,3,0.18),transparent_34%),linear-gradient(180deg,#4C2600_0%,#2b1500_52%,#4C2600_100%)]">
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
