/**
 * UI Text Content Preview
 * This shows what content will be populated in the UI Text Editor
 */

console.log('🎯 UI Text Editor Content Preview');
console.log('=====================================');

const sections = [
  {
    name: 'Hero Section',
    key: 'hero',
    fields: ['heading', 'subheading', 'wa', 'lm'],
    description: 'Main banner text on homepage'
  },
  {
    name: 'Navigation',
    key: 'nav', 
    fields: ['home', 'services', 'about', 'team', 'gallery', 'testi', 'contactus', 'email'],
    description: 'Navigation menu labels'
  },
  {
    name: 'Services',
    key: 'services',
    fields: ['vaa', 'vaadesc', 'vaasub', 'vab', 'vabdesc', 'wedding', 'weddingsub', 'weddingdesc', 'weddingbtn', 'translate', 'translatedesc', 'travel', 'traveldesc', 'others', 'otherssub', 'email', 'wa'],
    description: 'All service descriptions and titles'
  },
  {
    name: 'About Us',
    key: 'about',
    fields: ['heading', 'desc'],
    description: 'About section content'
  },
  {
    name: 'Team',
    key: 'team',
    fields: ['heading'],
    description: 'Team section title'
  },
  {
    name: 'Gallery',
    key: 'gallery',
    fields: ['heading'],
    description: 'Gallery section title'
  },
  {
    name: 'Testimonials',
    key: 'testimonial',
    fields: ['heading', 'seeall'],
    description: 'Testimonial section content'
  },
  {
    name: 'Footer',
    key: 'footer',
    fields: ['desc', 'email', 'wa', 'desc2', 'legal', 'legaldetails', 'sub', 'firstlink', 'secondlink', 'thirdlink', 'fourthlink', 'fifthlink', 'akte', 'copy'],
    description: 'Footer content and links'
  },
  {
    name: 'Gallery Page',
    key: 'galleryPage',
    fields: ['heading', 'noImages', 'backToHome'],
    description: 'Gallery page specific text'
  },
  {
    name: 'Testimonials Page',
    key: 'testimonialsPage',
    fields: ['heading', 'description', 'backToHome', 'noTestimonials'],
    description: 'Testimonials page specific text'
  },
  {
    name: 'Contact Form',
    key: 'contactForm',
    fields: ['title', 'name', 'phone', 'email', 'province', 'services', 'help'],
    description: 'Contact form field labels'
  },
  {
    name: 'Notifications',
    key: 'notif',
    fields: ['update', 'ck', 'title', 'sub', 'desc'],
    description: 'Notification modal content'
  }
];

sections.forEach((section, index) => {
  console.log(`${index + 1}. ${section.name} (${section.key})`);
  console.log(`   Description: ${section.description}`);
  console.log(`   Fields: ${section.fields.length} fields`);
  console.log(`   Fields: ${section.fields.join(', ')}`);
  console.log('');
});

console.log(`📊 Summary:`);
console.log(`   • Total sections: ${sections.length}`);
console.log(`   • Total fields: ${sections.reduce((sum, section) => sum + section.fields.length, 0)}`);
console.log(`   • Languages: English + Indonesian`);
console.log(`   • Total text entries: ${sections.reduce((sum, section) => sum + section.fields.length, 0) * 2}`);

export { sections };