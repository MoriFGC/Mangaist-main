import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { updateUserProfile, updateUserProfileImage } from "../../services/api";

const UpdateProfileDialog = ({ isOpen, closeModal, user, onProfileUpdate }) => {
  // Stato del form
  const [formData, setFormData] = useState({
    name: user.name || "",
    cognome: user.cognome || "",
    nickname: user.nickname || "",
    profilePublic: user.profilePublic,
    profileImage: user.profileImage,
    description: user.description || "", // Aggiungiamo la description
  });
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Gestore per il cambiamento dell'immagine del profilo
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedUser = await updateUserProfile(user._id, formData);

      if (newProfileImage) {
        const imageFormData = new FormData();
        imageFormData.append("profileImage", newProfileImage);
        const imageResponse = await updateUserProfileImage(
          user._id,
          imageFormData
        );
        updatedUser = {
          ...updatedUser,
          profileImage: imageResponse.data.profileImage,
        };
      }

      onProfileUpdate(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Update Profile
                </DialogTitle>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg ps-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="cognome"
                      className="block text-sm font-medium text-white"
                    >
                      Surname
                    </label>
                    <input
                      type="text"
                      name="cognome"
                      id="cognome"
                      value={formData.cognome}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg ps-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium text-white"
                    >
                      Nickname
                    </label>
                    <input
                      type="text"
                      name="nickname"
                      id="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg ps-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-white"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-white bg-button-bg ps-2"
                      placeholder="Write a brief description about yourself..."
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="profileImage"
                      className="block text-sm font-medium text-white"
                    >
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="profileImage"
                      id="profileImage"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                      file:text-black"
                    />
                  </div>
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      name="profilePublic"
                      id="profilePublic"
                      checked={formData.profilePublic}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="profilePublic"
                      className="ml-2 block text-sm text-white"
                    >
                      Make profile public
                    </label>
                  </div>
                  <div className="mt-4 flex gap-2 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent hover:border-white px-4 py-2 text-sm font-medium text-white"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center items-center gap-1 rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black hover:text-black hover:border-black hover:bg-emerald-500"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateProfileDialog;
