import React from 'react'
import Hero from '../../components/web/Hero'
import AboutSection from '../../components/web/About'
import ProductCategories from '../../components/web/ProductCategories'
import ProductsByCategory from '../../components/web/ProductsByCategory'

const HomePage = () => {
    return (
        <>
            <Hero />
            <AboutSection/>
            <ProductCategories/>
            <ProductsByCategory/>
        </>
    )
}

export default HomePage