import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            My fashion shopping app is a modern and user-friendly e-commerce
            platform designed to make clothing and accessory shopping simple and
            enjoyable. It offers a wide range of trendy collections for men,
            women, and kids, with clear product details, multiple size options,
            and high-quality images for better selection.
          </p>
          <p>
            My fashion shopping app is a stylish and feature-rich e-commerce
            platform built to deliver a smooth and engaging online shopping
            experience. It showcases a diverse collection of fashionable
            clothing and accessories for men, women, and kids, keeping up with
            the latest trends and seasonal styles. clicks.
          </p>
          <b>Our Vision</b>
          <p>
            Our vision is to become a trusted and inspiring fashion destination
            that empowers people to express their individuality through style.
            We aim to make trendy, high-quality, and affordable fashion
            accessible to everyone by delivering a seamless, innovative, and
            enjoyable online shopping experience.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We are committed to delivering the highest standards of quality
            across every aspect of our fashion shopping app. From carefully
            curated products and accurate size specifications to secure
            transactions and reliable delivery, we ensure each step meets strict
            quality checks.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Convenience:</b>
          <p className="text-gray-600">
            We prioritize convenience by designing our fashion shopping app to
            be simple, fast, and accessible anytime, anywhere. With easy
            navigation, smart search and filters, quick add-to-cart options, and
            a smooth checkout process, users can shop effortlessly without
            unnecessary steps.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">
            We are dedicated to providing exceptional customer service that puts
            our customers first. Our support team is always ready to assist with
            inquiries, order issues, and product guidance, ensuring quick and
            reliable resolutions.
          </p>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default About;
