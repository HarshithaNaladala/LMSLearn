function WhyChooseUs() {
    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Discover the Advantages
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
                    <Feature icon="💵" title="Maximize Your Budget" description="Learn more for less with our competitively priced courses tailored to your financial and educational needs." />
                    <Feature icon="🕒" title="Learn on Your Schedule" description="Gain lifetime access to all course materials—learn at your pace and revisit content whenever you need." />
                    <Feature icon="📚" title="Quality Over Quantity" description="Each course is crafted with a focus on providing valuable, practical skills and knowledge by industry experts." />
                    <Feature icon="🔍" title="Tailored Learning Paths" description="Enjoy a personalized learning experience designed to help you achieve your personal and professional goals." />
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title, description }) {
    return (
        <div>
            <div className="text-5xl">{icon}</div>
            <h3 className="mt-2 text-lg leading-6 font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-base text-gray-500">{description}</p>
        </div>
    );
}

export default WhyChooseUs;
