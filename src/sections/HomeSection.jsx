import HeroSlider from '../components/HeroSlider.jsx'
import HomeBestSellersSlider from '../components/HomeBestSellersSlider.jsx'
import HomeCategoriesPreview from './HomeCategoriesPreview.jsx'
import HomeFeaturedProducts from './HomeFeaturedProducts.jsx'
import HomeNewArrivals from './HomeNewArrivals.jsx'
import HomeDiscountedProducts from './HomeDiscountedProducts.jsx'
import HomeTestimonials from './HomeTestimonials.jsx'
import HomeBlogs from './HomeBlogs.jsx'

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
  reviews,
}) {
  return (
    <section className="hero-gradient-bg min-w-0 overflow-x-hidden">
      <HeroSlider slides={heroSlides} onPrimaryAction={onHeroAction} />

      <HomeBestSellersSlider products={products} theme={theme} />

      <HomeNewArrivals products={products} onViewAll={onViewAllProducts} theme={theme} />

      <HomeDiscountedProducts products={products} onViewAll={onViewAllProducts} theme={theme} />

      <HomeCategoriesPreview
        categories={categories}
        onViewAll={onViewAllCategories}
        onPickCategory={onPickCategory}
        theme={theme}
      />

      <HomeFeaturedProducts products={products} onViewAll={onViewAllProducts} theme={theme} />

      <HomeBlogs />

      <HomeTestimonials products={products} reviews={reviews} />
    </section>
  )
}
