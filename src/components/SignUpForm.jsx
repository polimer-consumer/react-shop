'use client'

import React, {useState} from 'react';
import styles from '../styles/forms.module.css';

export default function SignUpForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // You can add your form submission logic here
    };

    return (
        <div className={styles.container}>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <label
                    className={styles.label}
                    htmlFor="email">Email:
                </label>
                <input
                    className={styles.input}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label className={styles.label} htmlFor="username">Username:</label>
                <input
                    className={styles.input}
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <label className={styles.label} htmlFor="password">Password:</label>
                <input className={styles.input} type="password" id="password" name="password" required/>
                <input className={styles.input} type="submit" value="Register"/>
            </form>
        </div>
    );
}
