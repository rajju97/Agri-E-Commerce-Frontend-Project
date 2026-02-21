const AboutUs = () => {
    return (
        <div>
            {/* Hero */}
            <section className="bg-accent text-white py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="max-w-2xl mx-auto text-lg">
                    Ganga Agri Innovation Foundation is dedicated to empowering farmers and promoting
                    sustainable agriculture through technology and e-commerce.
                </p>
            </section>

            {/* Mission / Vision */}
            <section className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-4">
                            <i className="fas fa-bullseye mr-2"></i> Our Mission
                        </h2>
                        <p className="text-gray-600">
                            To bridge the gap between farmers and consumers by providing a digital marketplace
                            that ensures fair prices for agricultural products. We aim to eliminate middlemen
                            and empower farmers with direct market access, ensuring both quality products for
                            buyers and better income for sellers.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-primary mb-4">
                            <i className="fas fa-eye mr-2"></i> Our Vision
                        </h2>
                        <p className="text-gray-600">
                            To create a sustainable and transparent agricultural ecosystem where every farmer
                            has access to technology-driven solutions. We envision a world where organic farming
                            is mainstream and every consumer can trace their food back to its source.
                        </p>
                    </div>
                </div>
            </section>

            {/* Founder */}
            <section className="bg-gray-50 py-12 px-4">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Our Founder</h2>
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="w-32 h-32 mx-auto mt-6 overflow-hidden rounded-full border-4 border-primary">
                            <img src="founder.jpg" alt="Founder" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold">Dr. Satyapal Singh</h3>
                            <p className="text-primary font-semibold mb-3">Founder & President</p>
                            <p className="text-gray-600 text-sm">
                                With decades of experience in agricultural science and a passion for
                                empowering rural communities, Dr. Singh founded GAIF to revolutionize
                                how agricultural products reach the market.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="container mx-auto py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: 'fa-leaf', title: 'Sustainability', desc: 'Promoting eco-friendly farming practices and organic products.' },
                        { icon: 'fa-handshake', title: 'Fair Trade', desc: 'Ensuring fair prices for both farmers and consumers.' },
                        { icon: 'fa-seedling', title: 'Innovation', desc: 'Using technology to transform traditional agriculture.' },
                        { icon: 'fa-users', title: 'Community', desc: 'Building a strong network of farmers and buyers.' },
                    ].map((value, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                            <div className="text-primary text-4xl mb-4">
                                <i className={`fas ${value.icon}`}></i>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                            <p className="text-gray-600 text-sm">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="bg-primary text-white py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { number: '500+', label: 'Farmers' },
                            { number: '10,000+', label: 'Products' },
                            { number: '50,000+', label: 'Happy Customers' },
                            { number: '100+', label: 'Cities Served' },
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <p className="text-3xl font-bold">{stat.number}</p>
                                <p className="text-sm opacity-80">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-soil text-white p-4 text-center">
                <p>&copy; 2024 Ganga Agri Innovation Foundation. All rights reserved.</p>
                <div className="space-x-4 mt-2">
                    <a href="#" className="hover:text-accent">Privacy Policy</a>
                    <a href="#" className="hover:text-accent">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;
