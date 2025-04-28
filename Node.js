// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer for contact form
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-password'
    }
});

// API Routes
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: 'hello@alexcarter.com',
            subject: `New Contact Form Submission: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
            `,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Save to database (in a real application)
        // await saveContactFormToDB({ name, email, subject, message });

        res.json({ success: true, message: 'Thank you for your message! I will get back to you soon.' });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ error: 'An error occurred while submitting the form. Please try again.' });
    }
});

// Blog API Routes (example)
app.get('/api/blog/posts', (req, res) => {
    // In a real app, this would query a database
    const blogPosts = [
        {
            id: 1,
            title: "The Future of Web Development in 2023",
            excerpt: "Exploring the emerging technologies and trends that are shaping the future of web development this year and beyond.",
            date: "2023-06-15",
            comments: 12,
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
        },
        // More posts...
    ];
    res.json(blogPosts);
});

// Portfolio API Routes (example)
app.get('/api/portfolio/projects', (req, res) => {
    // In a real app, this would query a database
    const projects = [
        {
            id: 1,
            title: "Corporate Website Redesign",
            category: "web",
            description: "Complete redesign of a corporate website with improved user experience and modern aesthetics.",
            image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
        },
        // More projects...
    ];
    res.json(projects);
});

// Serve the main HTML file for all routes (for SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});