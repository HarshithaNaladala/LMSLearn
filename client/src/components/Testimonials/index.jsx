// components/Testimonials.js
import React from 'react';

function Testimonials() {
    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Join Thousands Achieving Their Goals
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Learners from around the globe share how our courses have helped them progress.
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <Testimonial 
                        image="/person2.jpg"
                        name="Alex Brown"
                        country="United States"
                        testimonial="Mastering backend development with Node.js has been a game-changer for my career in tech. The practical skills I gained led directly to a promotion at work."
                    />
                    <Testimonial 
                        image="/person6.jpeg"
                        name="John Doe"
                        country="Singapore"
                        testimonial="The React Basics course was incredibly thorough. It's amazing how much I was able to learn and apply in such a short period of time!"
                    />
                    <Testimonial 
                        image="person1.jpg"
                        name="Inés K."
                        country="France"
                        testimonial="The flexibility of learning cloud computing with AWS at my own pace made it possible to balance my studies with a full-time job. Highly recommend!"
                    />
                </div>
            </div>
        </div>
    );
}

function Testimonial({ image, name, country, testimonial }) {
    return (
        <div className="flex flex-col items-center text-center">
            <img className="w-43 h-48 rounded-full mb-4" src={image} alt={name} />
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{country}</p>
            <p className="mt-4 text-base text-gray-500 italic">{testimonial}</p>
        </div>
    );
}

export default Testimonials;
