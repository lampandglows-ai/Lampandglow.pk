import HeroSlider from '../components/HeroSlider.jsx'
import ProductSlider from '../components/ProductSlider.jsx'
import HomeCategoriesPreview from './HomeCategoriesPreview.jsx'
import HomeFeaturedProducts from './HomeFeaturedProducts.jsx'
import HomeTestimonials from './HomeTestimonials.jsx'

export default function HomeSection({
  heroSlides,
  onHeroAction,
  products,
  categories,
  testimonials,
  theme,
  onViewAllCategories,
  onPickCategory,
  onViewAllProducts,
}) {
  return (
    <section className={theme === 'dark' ? 'bg-transparent' : 'bg-white'}>
      <HeroSlider slides={heroSlides} onPrimaryAction={onHeroAction} />

      <ProductSlider products={products} theme={theme} />

      <HomeCategoriesPreview
        categories={categories}
        onViewAll={onViewAllCategories}
        onPickCategory={onPickCategory}
      />

      <HomeFeaturedProducts products={products} onViewAll={onViewAllProducts} theme={theme} />

      <HomeTestimonials testimonials={testimonials} />
    </section>
  )
}
