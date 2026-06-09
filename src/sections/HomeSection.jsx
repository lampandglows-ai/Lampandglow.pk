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
}) {
  return (
    <section className="bg-[#4C2600] bg-[radial-gradient(circle_at_top_left,rgba(255,218,3,0.18),transparent_34%),linear-gradient(180deg,#4C2600_0%,#2b1500_52%,#4C2600_100%)]">
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

      <HomeTestimonials testimonials={testimonials} />
    </section>
  )
}
