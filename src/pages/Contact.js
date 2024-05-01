import React, { useState } from 'react';

function Contact() {
  const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);

  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form logic here
    console.log(contact);
  };

  return (
    <div style={{display:'flex',flexDirection:'column'}} className='c'>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div style={{marginTop:'10%'}}>
          <label style={{marginTop:'100%'}}>Your Name</label>
          <input
            className={isDesktop ? "form1" : "form"}
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Your Email</label>
          <input
            className={isDesktop ? "form1" : "form"}

            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>The Subject</label>
          <input
          className={isDesktop ? "form1" : "form"}
            type="text"
            name="subject"
            value={contact.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>The Message</label>
          <textarea
          className={isDesktop ? "form1" : "form"}
            name="message"
            value={contact.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button className={isDesktop ? "b1" : "b"} type="submit">Send The Message</button>
      </form>
    </div>
  );
}

export default Contact;