#!/bin/bash

# Contact Form Setup Script for Digital Ganesha
# This script helps you set up the Formspree integration

echo "🕉️  Digital Ganesha - Contact Form Setup"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory of the project"
    exit 1
fi

echo "This script will help you configure the contact form with Formspree."
echo ""
echo "Before proceeding, make sure you have:"
echo "1. Created a Formspree account at https://formspree.io"
echo "2. Created a new form in your Formspree dashboard"
echo "3. Have your Formspree Form ID ready"
echo ""

read -p "Do you have your Formspree Form ID ready? (y/n): " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please complete the Formspree setup first:"
    echo "1. Go to https://formspree.io and create an account"
    echo "2. Create a new form"
    echo "3. Copy your Form ID (looks like: xpzgkqyw)"
    echo "4. Run this script again"
    echo ""
    exit 1
fi

echo ""
read -p "Enter your Formspree Form ID: " FORM_ID

if [ -z "$FORM_ID" ]; then
    echo "❌ Error: Form ID cannot be empty"
    exit 1
fi

# Validate Form ID format (basic check)
if [[ ! $FORM_ID =~ ^[a-zA-Z0-9]+$ ]]; then
    echo "❌ Error: Invalid Form ID format. Should contain only letters and numbers."
    exit 1
fi

echo ""
echo "Configuring contact form with Form ID: $FORM_ID"
echo ""

# Update the configuration file
CONFIG_FILE="src/config/formspree.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: Configuration file not found at $CONFIG_FILE"
    exit 1
fi

# Create a backup
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup"
echo "✅ Created backup of configuration file"

# Update the configuration
sed -i.tmp "s/YOUR_FORM_ID/$FORM_ID/g" "$CONFIG_FILE" && rm "${CONFIG_FILE}.tmp"

if [ $? -eq 0 ]; then
    echo "✅ Updated configuration file successfully"
else
    echo "❌ Error updating configuration file"
    echo "Restoring backup..."
    mv "${CONFIG_FILE}.backup" "$CONFIG_FILE"
    exit 1
fi

# Clean up backup
rm -f "${CONFIG_FILE}.backup"

echo ""
echo "🎉 Contact form setup completed!"
echo ""
echo "Configuration Summary:"
echo "====================="
echo "Form ID: $FORM_ID"
echo "Endpoint: https://formspree.io/f/$FORM_ID"
echo ""
echo "Next Steps:"
echo "1. Start your development server: npm run dev"
echo "2. Navigate to the contact section"
echo "3. Test the form by submitting a message"
echo "4. Check your email for the form submission"
echo ""
echo "Optional: Test the form programmatically by visiting:"
echo "http://localhost:5173/contact-test"
echo ""
echo "📚 For more information, see CONTACT_FORM_SETUP.md"
echo ""
echo "Happy coding! 🚀"
