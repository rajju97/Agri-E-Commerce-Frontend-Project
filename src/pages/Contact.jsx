import { useState } from 'react';
import Notification from '../components/Notification';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, this would send to a backend/Firebase
        console.log("Contact form submitted:", formData);
        setNotification({ message: 'Thank you! Your message has been sent successfully.', type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div>
            {/* Hero */}
            <section className="bg-accent text-white py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="max-w-2xl mx-auto text-lg">
                    Have questions? We would love to hear from you. Reach out and we will get back to you as soon as possible.
                </p>
            </section>

            <section className="container mx-auto py-12 px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-white p-3 rounded-full">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Address</h3>
                                    <p className="text-base-content/80">Ganga Agri Innovation Foundation, New Delhi, India</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-white p-3 rounded-full">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-base-content/80">+91 XXXXX XXXXX</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-white p-3 rounded-full">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-base-content/80">info@gaif.org</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-white p-3 rounded-full">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Working Hours</h3>
                                    <p className="text-base-content/80">Mon - Sat: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-8">
                            <h3 className="font-semibold mb-3">Follow Us</h3>
                            <div className="flex gap-4">
                                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="bg-base-200 p-3 rounded-full hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <i className={`fab fa-${social}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-base-100 p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                        <Notification message={notification.message} type={notification.type} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Name</label>
                                <input
                                    type="text" name="name" value={formData.name}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input
                                    type="email" name="email" value={formData.email}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Subject</label>
                                <input
                                    type="text" name="subject" value={formData.subject}
                                    onChange={handleChange} required
                                    className="input input-bordered w-full"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                    name="message" value={formData.message}
                                    onChange={handleChange} required
                                    className="textarea textarea-bordered w-full" rows="5"
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                <i className="fas fa-paper-plane mr-2"></i> Send Message
                            </button>
                        </form>
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

export default Contact;
