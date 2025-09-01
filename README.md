# Sparx - Engineers Week 2025

A modern, responsive website for the Sparx Engineers Week event organized by the EMAS Committee. This project showcases technical and non-technical events with a beautiful UI and interactive features.

## 🚀 Features

- **Responsive Design**: Works seamlessly on all devices
- **Dark/Light Theme Toggle**: User preference for viewing experience
- **Interactive Registration**: Dedicated registration page with form
- **Smooth Animations**: Engaging user experience with scroll animations
- **Modern UI**: Clean, professional design with gradient backgrounds
- **Event Management**: Comprehensive event listing and scheduling
- **Dynamic Content**: Events and schedule rendered from data files
- **Modular Architecture**: Separated concerns for easy maintenance
- **Multi-Page Structure**: Dedicated pages for different functionalities

## 📁 Project Structure

```
Courser/
├── index.html              # Main homepage with events overview
├── schedule.html           # Dedicated schedule page with day filters
├── registration.html       # Dedicated registration form page
├── styles.css              # All CSS styling and themes
├── script.js               # Core features (theme toggle, animations)
├── events-data.js          # Events and schedule data configuration
├── registration.js         # Registration form management
├── events-renderer.js      # Dynamic rendering of events/schedule
└── README.md               # Project documentation
```

## 🌐 **Page Structure**

### 1. **`index.html`** - Main Homepage
- **Hero section** with call-to-action
- **About section** with event statistics
- **Events overview** with technical and non-technical categories
- **Call-to-action buttons** linking to schedule and registration pages
- **Contact information** for the EMAS Committee

### 2. **`schedule.html`** - Dedicated Schedule Page
- **Complete event timeline** for all 5 days
- **Day filtering** (All Days, Day 1-5)
- **Interactive schedule** with hover effects
- **Schedule summary** with statistics
- **Navigation** back to main page

### 3. **`registration.html`** - Dedicated Registration Page
- **Events preview** showing available technical and non-technical events
- **Comprehensive registration form** with all required fields
- **Form validation** and success messages
- **Responsive design** for all devices
- **Navigation** back to main page

## 🎯 **Key Benefits of Separation**

### **Better User Experience**
- **Focused content** - each page has a single purpose
- **Faster loading** - smaller, focused pages
- **Better navigation** - clear separation of concerns
- **Mobile friendly** - easier to navigate on small screens

### **Easier Maintenance**
- **Modular code** - each page can be updated independently
- **Clear structure** - developers know exactly where to make changes
- **Reusable components** - shared CSS and JavaScript files
- **Easier debugging** - isolate issues to specific pages

### **SEO Benefits**
- **Better indexing** - search engines can understand page purposes
- **Focused keywords** - each page targets specific content
- **Improved navigation** - better internal linking structure

## 🚀 **Getting Started**

1. **Open `index.html`** in your browser to view the main page
2. **Click "View Full Schedule"** to see the detailed schedule page
3. **Click "Register Now"** to access the registration form
4. **Use the navigation menu** to move between pages
5. **Toggle theme** using the dark/light mode button

## 🛠 **Technical Details**

### **Frontend Technologies**
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox, Grid, and animations
- **Vanilla JavaScript** - No frameworks, pure functionality
- **Responsive Design** - Mobile-first approach

### **File Organization**
- **Data Layer** (`events-data.js`) - Centralized event information
- **Business Logic** (`registration.js`, `events-renderer.js`) - Core functionality
- **Presentation Layer** (HTML files) - User interface
- **Styling Layer** (`styles.css`) - Visual design and themes

### **Browser Compatibility**
- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile devices** (iOS Safari, Chrome Mobile)
- **Responsive design** for all screen sizes

## 📱 **Responsive Features**

- **Mobile-first design** approach
- **Flexible layouts** using CSS Grid and Flexbox
- **Touch-friendly** navigation and buttons
- **Optimized typography** for all screen sizes
- **Smooth animations** that work on mobile devices

## 🎨 **Design Features**

- **Modern gradient backgrounds** with smooth transitions
- **Card-based layouts** for easy content organization
- **Consistent color scheme** throughout all pages
- **Professional typography** with proper hierarchy
- **Interactive elements** with hover effects and animations

## 🔧 **Customization**

### **Adding New Events**
1. Edit `events-data.js` to add new events
2. Events automatically appear on all pages
3. No need to modify HTML files

### **Changing Styles**
1. Modify `styles.css` for visual changes
2. All pages automatically inherit updates
3. Consistent styling across the entire site

### **Adding New Pages**
1. Create new HTML file following the existing structure
2. Include the shared CSS and JavaScript files
3. Add navigation links in the header

## 📞 **Support**

For technical support or questions about the website:
- **Email**: tech@emas.edu
- **Phone**: +91 98765 43211

## 📄 **License**

This project is created for the EMAS Committee and Engineers Week 2025.

---

**Built with ❤️ for the EMAS Committee and Engineers Week 2025**

