import { useState } from "react";

import API from "../../services/api";

const CreateComplaint = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = new FormData();

      data.append("title", formData.title);

      data.append(
        "description",
        formData.description
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "location",
        formData.location
      );

      if (image) {
        data.append("image", image);
      }

      await API.post(
        "/complaints",
        data
      );

      alert("Complaint submitted");

    } catch (error) {
      alert("Failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">

      <h2 className="text-2xl font-bold mb-6">
        Create Complaint
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Submit
        </button>

      </form>

    </div>
  );
};

export default CreateComplaint;