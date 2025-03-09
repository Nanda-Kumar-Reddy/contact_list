import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { VscClose } from "react-icons/vsc";
import { IconBaseProps } from "react-icons";
import "./index.css";
interface contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}
function Home() {
  const [contacts, setContacts] = useState<contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [popupName, setPopupName] = useState("");
  const [popupEmail, setPopupEmail] = useState("");
  const [popupPhone, setPopupPhone] = useState("");
  const [selectContact, setSelectedContact] = useState<contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const VscCloseIcon = VscClose as React.FC<IconBaseProps>;

  useEffect(() => {
    fetch("http://localhost:8000/getContacts")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
      });
  }, []);

  const addContactToList = async () => {
    console.log("Adding contact to list");
    try {
      const response = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
        }),
      });
      console.log("response", response);
      const data = await response.json();
      setContacts([...contacts, data]);
    } catch (e) {
      console.log("error", e);
    }

    setName("");
    setEmail("");
    setPhone("");
    //   .then((data) => {
    //     setContacts([...contacts, data]);
    //   });
  };
  const handleSubmitContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addContactToList();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handlePopupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopupName(e.target.value);
  };

  const handlePopupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopupEmail(e.target.value);
  };
  const handlePopupPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopupPhone(e.target.value);
  };

  const handleEditContact = async (id: string) => {
    console.log("Editing contact");
    try {
      const response = await fetch(
        `http://localhost:8000/updateContact/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: popupName,
            email: popupEmail,
            phone: popupPhone,
          }),
        }
      );
      console.log("response", response);
      const data = await response.json();
      console.log("data", data);
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
    console.log("Deleting contact");
    try {
      const response = await fetch(
        `http://localhost:8000/deleteContact/${id}`,
        { method: "DELETE" }
      );
      setContacts((prevContact) => [...prevContact]);
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="contactList-main-container">
      <div className="contact-input-container">
        <input
          onChange={handleNameChange}
          type="text"
          name="name"
          placeholder="Name"
          className="input-feild"
        />
        <input
          onChange={handleEmailChange}
          type="email"
          name="email"
          placeholder="Email"
          className="input-feild"
        />
        <input
          onChange={handlePhoneChange}
          type="text"
          name="phone"
          placeholder="Phone"
          className="input-feild"
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
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="contact-modal-content">
          <div className="close-container">
            <div className="post-header">
              <h1 className="popup-heading">Edit the contact</h1>
            </div>
            <VscCloseIcon onClick={handleModalClose} className="close-button" />
          </div>
          <div className="popup-content">
            <div>
              <input
                onChange={handlePopupNameChange}
                type="text"
                name="name"
                value={popupName}
                placeholder="Name"
                className="input-feild"
              />
              <input
                onChange={handlePopupEmailChange}
                type="email"
                name="email"
                value={popupEmail}
                placeholder="Email"
                className="input-feild"
              />
              <input
                onChange={handlePopupPhoneChange}
                type="text"
                name="phone"
                value={popupPhone}
                placeholder="Phone"
                className="input-feild"
              />
            </div>

            <div>
              <button
                onClick={() => handleEditContact(selectContact?._id || "")}
                className="update-button"
              >
                Update Contact
              </button>
            </div>
          </div>
        </div>

        {/* Add image resizing controls here (optional) */}
        <div className="posting-actions"></div>
      </Modal>
      <h1>Contacts List</h1>
      <ul>
        {contacts.map((contact) => (
          <div className="contact-list">
            <div className="each-contact-container">
              <div className="fields-list">
                <li key={contact._id}>
                  <ol className="eact-contact">
                    <li>Name: {contact.name}</li>
                    <li>Email: {contact.email}</li>
                    <li>Phone: {contact.phone}</li>
                  </ol>
                </li>
              </div>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedContact(contact);
                  }}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteContact(contact._id)}
                  className="edit-button"
                >
                  Delete
                </button>
              </div>
            </div>
            {/* <button  onClick={() => handleEditContact(contact._id)}>Edit</button> */}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Home;
