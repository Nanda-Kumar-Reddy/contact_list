import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { VscClose } from "react-icons/vsc";
import { IconBaseProps } from "react-icons";
import "./index.css";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [popupName, setPopupName] = useState("");
  const [popupEmail, setPopupEmail] = useState("");
  const [popupPhone, setPopupPhone] = useState("");
  const [selectContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const VscCloseIcon = VscClose as React.FC<IconBaseProps>;

  useEffect(() => {
    fetch("http://localhost:8000/getContacts")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const addContactToList = async () => {
    try {
      const response = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await response.json();
      setContacts([...contacts, data]);
    } catch (e) {
      console.log("error", e);
    }
    setName("");
    setEmail("");
    setPhone("");
  };

  const handleSubmitContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addContactToList();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhone(e.target.value);
  const handlePopupNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPopupName(e.target.value);
  const handlePopupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPopupEmail(e.target.value);
  const handlePopupPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPopupPhone(e.target.value);

  const handleEditContact = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/updateContact/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: popupName,
            email: popupEmail,
            phone: popupPhone,
          }),
        }
      );
      const data = await response.json();
      const filteredData = contacts.filter(
        (contact) => contact._id !== data._id
      );
      setContacts([...filteredData, data]);
      setIsModalOpen(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/deleteContact/${id}`, {
        method: "DELETE",
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (e) {
      console.log("error", e);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      height: "450px",
      zIndex: "999",
      opacity: "1",
      backgroundColor: "white",
      borderRadius: "10px",
    },
  };

  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="contactList-main-container">
      <div className="contact-input-container">
        <input
          onChange={handleNameChange}
          type="text"
          name="name"
          placeholder="Name"
          className="input-field"
          value={name}
        />
        <input
          onChange={handleEmailChange}
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={email}
        />
        <input
          onChange={handlePhoneChange}
          type="text"
          name="phone"
          placeholder="Phone"
          className="input-field"
          value={phone}
        />
        <button
          className="add-contact-button"
          type="submit"
          onClick={handleSubmitContact}
        >
          Add Contact
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleModalClose}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="contact-modal-content">
          <div className="close-container">
            <h1 className="popup-heading">Edit Contact</h1>
            <VscCloseIcon onClick={handleModalClose} className="close-button" />
          </div>
          <div className="popup-content">
            <label htmlFor="popupName">Name</label>
            <input
              id="popupName"
              onChange={handlePopupNameChange}
              type="text"
              name="name"
              value={popupName}
              placeholder="Name"
              className="popup-input-field"
            />
            <label htmlFor="popupEmail">Email</label>
            <input
              id="popupEmail"
              onChange={handlePopupEmailChange}
              type="email"
              name="email"
              value={popupEmail}
              placeholder="Email"
              className="popup-input-field"
            />
            <label htmlFor="popupPhone">Phone</label>
            <input
              id="popupPhone"
              onChange={handlePopupPhoneChange}
              type="text"
              name="phone"
              value={popupPhone}
              placeholder="Phone"
              className="popup-input-field"
            />
            <button
              onClick={() => handleEditContact(selectContact?._id || "")}
              className="update-button"
            >
              Update Contact
            </button>
          </div>
        </div>
      </Modal>
      <h1>Contacts List</h1>
      <ul className="contacts-list">
        {contacts.map((contact) => (
          <li key={contact._id} className="contact-list-item">
            <div className="each-contact-container">
              <div className="fields-list">
                <span>Name: {contact.name}</span>
                <span>Email: {contact.email}</span>
                <span>Phone: {contact.phone}</span>
              </div>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    setPopupName(contact.name);
                    setPopupEmail(contact.email);
                    setPopupPhone(contact.phone);
                    setSelectedContact(contact);
                    setIsModalOpen(true);
                  }}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteContact(contact._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
