// pages/dashboard/connect.tsx
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";

const Connect = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Your name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobile: Yup.number(),
      message: Yup.string().required("Please enter your message"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Send Message →", values);
      // handleEmailSend(values) or Supabase insert here

      const  formdata ={...values}
      
      if (formdata.mobile == "") {
        formdata.mobile = "965453181";
      }
      console.log("formdata", formdata);
      
      setIsLoading(true);
      emailjs
        .send(
          "service_600fays", // Replace with your actual Service ID
          "template_zz47i88", // Replace with your Template ID
          formdata,
          "3MdbeSJOkbrN9IOP0" // Replace with your Public Key
        )
        .then(
          (response) => {
            console.log("Email successfully sent!", response);
            alert("Message sent successfully!");
            resetForm();
          },
          (error) => {
            console.log("Failed to send email:", error);
            alert("Failed to send message. Please try again later.");
          }
        )
        .finally(() => setIsLoading(false));
    },
  });

  return (
    <div className="min-h-screen sm:px-4 py-8 md:py-16 flex flex-col items-center mt-8 ">
      <div className="w-full max-w-2xl p-3 sm:p-6 md:p-10 bg-gray-50 dark:bg-slate-800 shadow-lg rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-center">
          📬 Connect with EduMate Team
        </h1>
        <p className="text-gray-600 text-sm md:text-base text-center mb-6 dark:text-gray-400">
          Have questions, ideas, or feedback? We'd love to hear from you.
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-sm mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full border border-gray-300 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Rohit Kumar"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Your mobile (optional)</label>
            <input
              type="number"
              name="mobile"
              onChange={formik.handleChange}
              value={formik.values.mobile}
              className="w-full border border-gray-300 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Your Mobile No."
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full border border-gray-300 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Message</label>
            <textarea
              name="message"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.message}
              className="w-full border border-gray-300 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Your message or suggestion..."
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-sm">{formik.errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2 hover:bg-blue-700 transition"
          >
           {isLoading? "Sending...": "Send Message"} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connect;
