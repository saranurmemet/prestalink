/**
 * ZER Company İş İlanları Oluşturma Script'i
 * 
 * Bu script ZER company için 20 adet detaylı iş ilanı oluşturur.
 * Tüm alanlar eksiksiz doldurulmuştur.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

// 20 adet detaylı iş ilanı
const jobListings = [
  {
    title: 'Senior Quality Control Engineer',
    description: `We are seeking an experienced Quality Control Engineer to join our manufacturing team in Germany. The ideal candidate will have extensive experience in quality assurance, ISO standards, and precision manufacturing processes.

**Key Responsibilities:**
- Conduct comprehensive quality inspections on automotive components and precision parts
- Implement and maintain ISO 9001:2015 quality management systems
- Operate and maintain Coordinate Measuring Machines (CMM) and other precision measurement equipment
- Develop and execute quality control procedures and documentation
- Lead root cause analysis investigations for non-conformities
- Train and mentor quality control technicians
- Collaborate with production teams to ensure quality standards are met
- Prepare detailed quality reports and present findings to management
- Participate in supplier quality audits and assessments

**Required Qualifications:**
- Bachelor's degree in Mechanical Engineering, Quality Engineering, or related field
- Minimum 5 years of experience in quality control within manufacturing industry
- Strong knowledge of ISO 9001:2015 standards
- Proficiency in CMM operation (Zeiss, Mitutoyo preferred)
- Experience with Six Sigma methodologies
- Excellent analytical and problem-solving skills
- Strong attention to detail and accuracy
- Fluent in English; German language skills are a plus

**What We Offer:**
- Competitive salary package with performance bonuses
- Comprehensive health insurance and retirement benefits
- Professional development opportunities
- Relocation assistance for international candidates
- Modern work environment with state-of-the-art equipment
- Support for work permit and visa processes`,
    salary: '€3,500 - €4,500/month',
    location: 'Frankfurt, Germany',
    requiredExperience: '5+ years',
    requiredLanguage: 'English, German',
    workType: 'full-time',
  },
  {
    title: 'Textile Production Specialist',
    description: `Join our textile manufacturing team in France! We are looking for a skilled Textile Production Specialist with hands-on experience in garment manufacturing and quality control.

**Key Responsibilities:**
- Operate industrial sewing machines for garment assembly and production
- Perform quality checks on fabrics, materials, and finished products
- Monitor production lines to ensure efficiency and quality standards
- Maintain production equipment and report any technical issues
- Follow production schedules and meet daily production targets
- Implement quality control procedures throughout the production process
- Collaborate with design and quality teams to ensure product specifications
- Train new team members on production procedures and safety protocols
- Maintain accurate production records and documentation

**Required Qualifications:**
- Minimum 3 years of experience in textile or garment manufacturing
- Proficiency in operating industrial sewing machines
- Strong knowledge of fabric types, garment construction, and quality standards
- Ability to work in a fast-paced production environment
- Excellent attention to detail and quality focus
- Physical ability to stand for extended periods and lift materials
- Basic understanding of production planning and scheduling
- Fluent in French or English; additional languages are beneficial

**What We Offer:**
- Competitive hourly wage with overtime opportunities
- Stable employment with long-term career prospects
- Comprehensive training programs
- Health insurance and social security benefits
- Support for accommodation and integration
- Opportunity to work with international brands`,
    salary: '€2,200 - €2,800/month',
    location: 'Lyon, France',
    requiredExperience: '3-5 years',
    requiredLanguage: 'French, English',
    workType: 'full-time',
  },
  {
    title: 'Registered Nurse - ICU',
    description: `We are seeking a dedicated Registered Nurse to join our Intensive Care Unit team in Belgium. This position offers an excellent opportunity to work in a modern healthcare facility with advanced medical equipment.

**Key Responsibilities:**
- Provide comprehensive critical care to patients in the intensive care unit
- Monitor and assess patient vital signs, conditions, and responses to treatment
- Administer medications, IV therapies, and life support interventions
- Operate and maintain complex medical equipment (ventilators, monitors, infusion pumps)
- Collaborate with multidisciplinary healthcare teams including doctors, specialists, and therapists
- Document patient care accurately and maintain detailed medical records
- Educate patients and families about conditions, treatments, and care plans
- Respond to medical emergencies and code situations
- Participate in quality improvement initiatives and evidence-based practice

**Required Qualifications:**
- Valid nursing license (recognized in Belgium/EU)
- Bachelor's degree in Nursing
- Minimum 3 years of experience in ICU or critical care setting
- Current BLS (Basic Life Support) and ACLS (Advanced Cardiac Life Support) certifications
- Strong clinical assessment and critical thinking skills
- Ability to work under pressure in high-stress environments
- Excellent communication and interpersonal skills
- Compassionate and patient-centered approach to care
- Fluent in English; Dutch or French language skills required

**What We Offer:**
- Competitive salary with shift differentials
- Comprehensive health insurance and pension benefits
- Professional development and continuing education support
- Modern healthcare facility with advanced technology
- Support for license recognition and credentialing
- Relocation assistance and housing support
- Work-life balance with flexible scheduling options`,
    salary: '€3,200 - €4,000/month',
    location: 'Brussels, Belgium',
    requiredExperience: '3-5 years',
    requiredLanguage: 'English, Dutch/French',
    workType: 'full-time',
  },
  {
    title: 'Software Engineer - Full Stack',
    description: `Join our innovative tech team in the Netherlands! We are looking for a talented Full Stack Software Engineer to develop cutting-edge web applications and digital solutions.

**Key Responsibilities:**
- Design and develop scalable web applications using modern technologies
- Build responsive frontend interfaces with React, Next.js, and TypeScript
- Develop robust backend APIs using Node.js, Express, and MongoDB
- Implement secure authentication and authorization systems
- Write clean, maintainable, and well-documented code
- Collaborate with cross-functional teams including designers and product managers
- Participate in code reviews and maintain coding standards
- Troubleshoot and debug applications to ensure optimal performance
- Stay updated with latest technologies and industry best practices
- Contribute to architectural decisions and technical planning

**Required Qualifications:**
- Bachelor's degree in Computer Science, Software Engineering, or related field
- Minimum 4 years of experience in full-stack development
- Strong proficiency in JavaScript/TypeScript, React, and Node.js
- Experience with databases (MongoDB, PostgreSQL)
- Knowledge of RESTful APIs and GraphQL
- Familiarity with cloud platforms (AWS, Azure, or GCP)
- Understanding of version control (Git) and CI/CD pipelines
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities
- Fluent in English; Dutch language skills are a plus

**What We Offer:**
- Competitive salary with performance bonuses
- Stock options and equity participation
- Flexible working hours and remote work options
- Professional development budget for courses and conferences
- Modern office with latest equipment and tools
- Health insurance and comprehensive benefits package
- Visa sponsorship and relocation support
- Dynamic and innovative work environment`,
    salary: '€4,000 - €5,500/month',
    location: 'Amsterdam, Netherlands',
    requiredExperience: '4+ years',
    requiredLanguage: 'English',
    workType: 'full-time',
  },
  {
    title: 'Hospitality Manager - Hotel Operations',
    description: `We are seeking an experienced Hospitality Manager to oversee hotel operations in a luxury hotel in Switzerland. This role requires strong leadership skills and a passion for delivering exceptional guest experiences.

**Key Responsibilities:**
- Manage daily hotel operations including front desk, housekeeping, and guest services
- Ensure high standards of service quality and guest satisfaction
- Train, supervise, and motivate hotel staff across all departments
- Develop and implement operational policies and procedures
- Monitor financial performance and manage budgets
- Handle guest complaints and resolve issues promptly
- Coordinate with various departments to ensure smooth operations
- Conduct regular inspections to maintain quality standards
- Plan and execute special events and group bookings
- Maintain relationships with suppliers and vendors

**Required Qualifications:**
- Bachelor's degree in Hospitality Management, Business Administration, or related field
- Minimum 5 years of experience in hotel management or hospitality operations
- Strong leadership and team management skills
- Excellent customer service and communication abilities
- Knowledge of hotel management software and systems
- Understanding of financial management and budgeting
- Ability to work flexible hours including weekends and holidays
- Multilingual skills (English, French, German preferred)
- Problem-solving and decision-making capabilities

**What We Offer:**
- Competitive salary with performance bonuses
- Comprehensive health and dental insurance
- Accommodation assistance or housing allowance
- Professional development opportunities
- Employee discounts on hotel services
- Beautiful work environment in luxury hotel setting
- Support for work permits and visa processing
- Career advancement opportunities within the group`,
    salary: '€3,800 - €4,800/month',
    location: 'Zurich, Switzerland',
    requiredExperience: '5+ years',
    requiredLanguage: 'English, French, German',
    workType: 'full-time',
  },
  {
    title: 'CNC Machine Operator',
    description: `Join our precision manufacturing team in Austria! We are looking for a skilled CNC Machine Operator to produce high-quality precision components for the automotive and aerospace industries.

**Key Responsibilities:**
- Set up and operate CNC milling and turning machines
- Read and interpret technical drawings and blueprints
- Program CNC machines using G-code and CAM software
- Perform quality inspections using precision measuring tools
- Maintain machines and perform routine maintenance tasks
- Troubleshoot machine issues and make adjustments as needed
- Ensure production targets are met while maintaining quality standards
- Follow safety protocols and maintain clean work environment
- Document production data and quality measurements
- Collaborate with quality control and engineering teams

**Required Qualifications:**
- Technical diploma or certification in CNC machining or mechanical engineering
- Minimum 3 years of experience operating CNC machines
- Proficiency in reading technical drawings and blueprints
- Knowledge of G-code programming and CAM software
- Experience with precision measuring tools (calipers, micrometers, CMM)
- Strong mechanical aptitude and attention to detail
- Ability to work independently and as part of a team
- Physical ability to stand for extended periods and lift materials
- Basic computer skills for machine programming
- Fluent in German or English

**What We Offer:**
- Competitive hourly wage with shift differentials
- Comprehensive training on advanced CNC equipment
- Health insurance and social security benefits
- Overtime opportunities
- Modern manufacturing facility with latest technology
- Support for accommodation and integration
- Career development opportunities
- Stable employment with long-term prospects`,
    salary: '€2,500 - €3,200/month',
    location: 'Vienna, Austria',
    requiredExperience: '3-5 years',
    requiredLanguage: 'German, English',
    workType: 'full-time',
  },
  {
    title: 'Construction Site Supervisor',
    description: `We are seeking an experienced Construction Site Supervisor to manage construction projects in Spain. This role requires strong leadership skills and comprehensive knowledge of construction processes and safety regulations.

**Key Responsibilities:**
- Supervise daily construction activities and coordinate work crews
- Ensure compliance with building codes, safety regulations, and quality standards
- Review construction plans and specifications
- Monitor project progress and ensure deadlines are met
- Manage construction materials, equipment, and resources
- Conduct safety meetings and implement safety protocols
- Coordinate with architects, engineers, and subcontractors
- Inspect work quality and ensure standards are maintained
- Prepare daily reports and maintain project documentation
- Resolve on-site issues and conflicts

**Required Qualifications:**
- Bachelor's degree in Civil Engineering, Construction Management, or related field
- Minimum 5 years of experience in construction supervision
- Strong knowledge of construction methods, materials, and safety regulations
- Excellent leadership and communication skills
- Ability to read and interpret construction drawings and specifications
- Proficiency in construction management software
- Valid driver's license
- Physical ability to work on construction sites
- Fluent in Spanish; English language skills are beneficial
- Construction safety certifications preferred

**What We Offer:**
- Competitive salary with project bonuses
- Company vehicle or transportation allowance
- Health insurance and social security benefits
- Professional development opportunities
- Support for work permits and visa processing
- Accommodation assistance
- Opportunity to work on diverse construction projects
- Career advancement within the company`,
    salary: '€3,000 - €4,000/month',
    location: 'Madrid, Spain',
    requiredExperience: '5+ years',
    requiredLanguage: 'Spanish, English',
    workType: 'full-time',
  },
  {
    title: 'Automotive Technician',
    description: `Join our automotive service team in Italy! We are looking for a skilled Automotive Technician to diagnose, repair, and maintain vehicles using advanced diagnostic equipment and tools.

**Key Responsibilities:**
- Diagnose vehicle problems using computerized diagnostic equipment
- Perform repairs and maintenance on engines, transmissions, brakes, and electrical systems
- Conduct vehicle inspections and safety checks
- Use specialized tools and equipment for automotive repairs
- Maintain accurate service records and documentation
- Communicate with customers about vehicle issues and repair options
- Order parts and manage inventory
- Stay updated with latest automotive technology and repair techniques
- Follow safety protocols and maintain clean work environment
- Train and mentor junior technicians

**Required Qualifications:**
- Technical diploma or certification in Automotive Technology
- Minimum 4 years of experience as an automotive technician
- Strong diagnostic and problem-solving skills
- Proficiency with automotive diagnostic equipment and tools
- Knowledge of various vehicle makes and models
- Ability to read technical manuals and wiring diagrams
- Excellent attention to detail and quality focus
- Customer service skills
- Physical ability to work in automotive service environment
- Fluent in Italian; English language skills are beneficial

**What We Offer:**
- Competitive salary with performance bonuses
- Health insurance and social security benefits
- Ongoing training on latest automotive technology
- Modern service facility with advanced equipment
- Tool allowance and professional development support
- Stable employment with career growth opportunities
- Support for work permits and integration
- Employee discounts on services and parts`,
    salary: '€2,800 - €3,500/month',
    location: 'Milan, Italy',
    requiredExperience: '4+ years',
    requiredLanguage: 'Italian, English',
    workType: 'full-time',
  },
  {
    title: 'Warehouse Operations Manager',
    description: `We are seeking an experienced Warehouse Operations Manager to oversee warehouse operations and logistics in Poland. This role requires strong organizational skills and experience in supply chain management.

**Key Responsibilities:**
- Manage daily warehouse operations including receiving, storage, and shipping
- Supervise warehouse staff and coordinate work schedules
- Implement and maintain inventory management systems
- Ensure accurate inventory counts and minimize discrepancies
- Optimize warehouse layout and storage efficiency
- Coordinate with suppliers, carriers, and customers
- Ensure compliance with safety regulations and quality standards
- Monitor key performance indicators and operational metrics
- Prepare reports on warehouse performance and inventory levels
- Implement process improvements to increase efficiency

**Required Qualifications:**
- Bachelor's degree in Logistics, Supply Chain Management, or related field
- Minimum 5 years of experience in warehouse or logistics management
- Strong knowledge of warehouse management systems (WMS)
- Experience with inventory management and logistics processes
- Excellent leadership and team management skills
- Strong organizational and problem-solving abilities
- Proficiency in Microsoft Office and warehouse software
- Ability to work in fast-paced environment
- Fluent in Polish; English language skills required
- Forklift certification preferred

**What We Offer:**
- Competitive salary with performance bonuses
- Health insurance and comprehensive benefits
- Professional development opportunities
- Modern warehouse facility with advanced systems
- Support for work permits and visa processing
- Accommodation assistance
- Career advancement opportunities
- Dynamic work environment`,
    salary: '€2,500 - €3,500/month',
    location: 'Warsaw, Poland',
    requiredExperience: '5+ years',
    requiredLanguage: 'Polish, English',
    workType: 'full-time',
  },
  {
    title: 'Electrical Engineer - Power Systems',
    description: `Join our engineering team in Sweden! We are looking for an experienced Electrical Engineer specializing in power systems to design and maintain electrical infrastructure.

**Key Responsibilities:**
- Design electrical power systems and distribution networks
- Conduct electrical system analysis and load calculations
- Prepare technical drawings, specifications, and documentation
- Oversee installation and commissioning of electrical systems
- Troubleshoot electrical issues and perform root cause analysis
- Ensure compliance with electrical codes and safety standards
- Collaborate with project teams and stakeholders
- Review and approve electrical designs and modifications
- Provide technical support and guidance to field technicians
- Stay updated with latest electrical technologies and standards

**Required Qualifications:**
- Bachelor's degree in Electrical Engineering
- Minimum 5 years of experience in power systems engineering
- Strong knowledge of electrical codes and safety standards
- Proficiency in electrical design software (AutoCAD, ETAP, etc.)
- Experience with power system analysis and protection
- Excellent analytical and problem-solving skills
- Strong communication and project management abilities
- Professional engineering license preferred
- Fluent in English; Swedish language skills are beneficial

**What We Offer:**
- Competitive salary with performance bonuses
- Comprehensive health and pension benefits
- Professional development and continuing education support
- Modern office with latest engineering tools
- Flexible working arrangements
- Support for work permits and relocation
- Opportunity to work on diverse engineering projects
- Career growth within the organization`,
    salary: '€4,500 - €6,000/month',
    location: 'Stockholm, Sweden',
    requiredExperience: '5+ years',
    requiredLanguage: 'English, Swedish',
    workType: 'full-time',
  },
  {
    title: 'Chef de Cuisine - Fine Dining',
    description: `We are seeking an experienced Chef de Cuisine to lead our fine dining kitchen in a prestigious restaurant in France. This role requires exceptional culinary skills and leadership abilities.

**Key Responsibilities:**
- Lead kitchen operations and manage culinary team
- Develop and execute innovative menus with high-quality ingredients
- Ensure consistent food quality and presentation standards
- Manage food costs and inventory while maintaining quality
- Train and mentor kitchen staff on culinary techniques
- Maintain kitchen hygiene and food safety standards
- Coordinate with front-of-house staff for seamless service
- Source high-quality ingredients and manage supplier relationships
- Create seasonal menus and special event menus
- Ensure compliance with health and safety regulations

**Required Qualifications:**
- Culinary degree or equivalent professional training
- Minimum 6 years of experience in fine dining restaurants
- Strong knowledge of French and international cuisine
- Excellent leadership and team management skills
- Creativity and passion for culinary arts
- Ability to work under pressure in fast-paced environment
- Knowledge of food safety and hygiene regulations
- Physical ability to work long hours on feet
- Fluent in French; English language skills are beneficial
- Experience with Michelin-starred restaurants preferred

**What We Offer:**
- Competitive salary with performance bonuses
- Health insurance and social security benefits
- Professional development and culinary training opportunities
- Work in prestigious fine dining establishment
- Support for work permits and visa processing
- Accommodation assistance
- Opportunity to work with world-class ingredients
- Career advancement in culinary industry`,
    salary: '€3,500 - €4,500/month',
    location: 'Paris, France',
    requiredExperience: '6+ years',
    requiredLanguage: 'French, English',
    workType: 'full-time',
  },
  {
    title: 'Pharmacy Technician',
    description: `Join our pharmacy team in Belgium! We are looking for a qualified Pharmacy Technician to assist pharmacists in dispensing medications and providing patient care services.

**Key Responsibilities:**
- Assist pharmacists in dispensing prescription medications
- Prepare and label medications accurately
- Maintain pharmacy inventory and order supplies
- Process insurance claims and handle billing
- Provide customer service and answer medication questions
- Maintain patient records and confidentiality
- Comply with pharmacy regulations and safety protocols
- Assist with medication therapy management
- Prepare compounded medications as needed
- Maintain clean and organized pharmacy environment

**Required Qualifications:**
- Pharmacy Technician certification or diploma
- Minimum 2 years of experience in pharmacy setting
- Strong knowledge of medications and pharmaceutical terminology
- Excellent attention to detail and accuracy
- Good communication and customer service skills
- Ability to work in fast-paced environment
- Basic computer skills for pharmacy software
- Understanding of pharmacy regulations and safety
- Fluent in Dutch or French; English language skills required
- Ability to work flexible hours including weekends

**What We Offer:**
- Competitive salary with benefits
- Health insurance and social security
- Professional development opportunities
- Modern pharmacy with latest technology
- Support for certification recognition
- Stable employment with career growth
- Support for work permits and integration
- Employee discounts on health products`,
    salary: '€2,200 - €2,800/month',
    location: 'Antwerp, Belgium',
    requiredExperience: '2-3 years',
    requiredLanguage: 'Dutch/French, English',
    workType: 'full-time',
  },
  {
    title: 'Welder - Industrial Manufacturing',
    description: `We are seeking a skilled Welder to join our industrial manufacturing team in Germany. This role requires expertise in various welding techniques and the ability to work with different materials.

**Key Responsibilities:**
- Perform welding operations using various techniques (MIG, TIG, ARC)
- Read and interpret welding blueprints and specifications
- Set up welding equipment and prepare materials
- Ensure weld quality meets industry standards and specifications
- Perform quality inspections and testing of welds
- Maintain welding equipment and tools
- Follow safety protocols and use protective equipment
- Work with various metals including steel, aluminum, and stainless steel
- Collaborate with engineering and quality teams
- Document welding procedures and quality records

**Required Qualifications:**
- Welding certification or technical training
- Minimum 4 years of experience in industrial welding
- Proficiency in MIG, TIG, and ARC welding techniques
- Ability to read blueprints and technical drawings
- Knowledge of welding codes and standards
- Strong attention to detail and quality focus
- Physical ability to work in industrial environment
- Ability to work in various positions (standing, kneeling, overhead)
- Fluent in German or English
- Safety certifications preferred

**What We Offer:**
- Competitive hourly wage with overtime opportunities
- Health insurance and social security benefits
- Comprehensive safety training and equipment
- Modern manufacturing facility
- Support for accommodation and integration
- Career development opportunities
- Stable employment with long-term prospects
- Tool allowance and professional development support`,
    salary: '€2,800 - €3,500/month',
    location: 'Munich, Germany',
    requiredExperience: '4+ years',
    requiredLanguage: 'German, English',
    workType: 'full-time',
  },
  {
    title: 'Dental Hygienist',
    description: `Join our dental practice in Switzerland! We are looking for a qualified Dental Hygienist to provide preventive dental care and patient education services.

**Key Responsibilities:**
- Perform dental cleanings and preventive treatments
- Conduct oral health assessments and screenings
- Take dental X-rays and impressions
- Provide patient education on oral hygiene and care
- Assist dentists during procedures as needed
- Maintain patient records and documentation
- Sterilize instruments and maintain infection control
- Schedule appointments and manage patient flow
- Apply fluoride treatments and sealants
- Screen for oral diseases and conditions

**Required Qualifications:**
- Dental Hygienist license or certification (recognized in Switzerland/EU)
- Minimum 2 years of experience in dental practice
- Strong knowledge of oral health and preventive care
- Excellent communication and patient care skills
- Attention to detail and gentle approach
- Ability to work with dental equipment and technology
- Understanding of infection control and safety protocols
- Fluent in German or French; English language skills required
- Professional and friendly demeanor

**What We Offer:**
- Competitive salary with benefits
- Health insurance and social security
- Professional development and continuing education
- Modern dental practice with latest equipment
- Support for license recognition
- Work-life balance with flexible scheduling
- Support for work permits and integration
- Beautiful work environment in Switzerland`,
    salary: '€3,000 - €3,800/month',
    location: 'Geneva, Switzerland',
    requiredExperience: '2-3 years',
    requiredLanguage: 'French/German, English',
    workType: 'full-time',
  },
  {
    title: 'HVAC Technician',
    description: `We are seeking an experienced HVAC Technician to install, maintain, and repair heating, ventilation, and air conditioning systems in the Netherlands.

**Key Responsibilities:**
- Install, maintain, and repair HVAC systems
- Diagnose HVAC problems and perform troubleshooting
- Perform routine maintenance and inspections
- Replace parts and components as needed
- Test and calibrate HVAC systems for optimal performance
- Read and interpret technical manuals and schematics
- Maintain service records and documentation
- Provide customer service and explain work performed
- Follow safety protocols and building codes
- Stay updated with latest HVAC technologies

**Required Qualifications:**
- HVAC certification or technical training
- Minimum 4 years of experience in HVAC installation and repair
- Strong knowledge of HVAC systems and components
- Ability to read technical drawings and schematics
- Physical ability to work in various environments
- Excellent problem-solving and diagnostic skills
- Valid driver's license
- Fluent in Dutch or English
- Safety certifications preferred

**What We Offer:**
- Competitive salary with performance bonuses
- Company vehicle or transportation allowance
- Health insurance and social security benefits
- Ongoing training on latest HVAC technology
- Tool allowance and equipment support
- Support for work permits and integration
- Stable employment with career growth
- Employee benefits and discounts`,
    salary: '€2,800 - €3,600/month',
    location: 'Rotterdam, Netherlands',
    requiredExperience: '4+ years',
    requiredLanguage: 'Dutch, English',
    workType: 'full-time',
  },
  {
    title: 'Logistics Coordinator',
    description: `Join our logistics team in Austria! We are looking for a Logistics Coordinator to manage shipping, transportation, and supply chain operations.

**Key Responsibilities:**
- Coordinate shipping and transportation activities
- Manage freight forwarding and customs documentation
- Track shipments and provide status updates
- Communicate with carriers, suppliers, and customers
- Prepare shipping documents and customs declarations
- Optimize logistics routes and reduce costs
- Resolve shipping issues and delays
- Maintain logistics records and documentation
- Monitor inventory levels and coordinate replenishment
- Ensure compliance with import/export regulations

**Required Qualifications:**
- Bachelor's degree in Logistics, Supply Chain, or related field
- Minimum 3 years of experience in logistics or freight forwarding
- Strong knowledge of international shipping and customs procedures
- Proficiency in logistics software and systems
- Excellent organizational and communication skills
- Ability to work under pressure and meet deadlines
- Attention to detail and problem-solving abilities
- Fluent in German; English language skills required
- Knowledge of import/export regulations

**What We Offer:**
- Competitive salary with performance bonuses
- Health insurance and comprehensive benefits
- Professional development opportunities
- Modern logistics facility
- Support for work permits and visa processing
- Accommodation assistance
- Career advancement opportunities
- Dynamic international work environment`,
    salary: '€2,600 - €3,400/month',
    location: 'Vienna, Austria',
    requiredExperience: '3-5 years',
    requiredLanguage: 'German, English',
    workType: 'full-time',
  },
  {
    title: 'Mechanical Maintenance Technician',
    description: `We are seeking a skilled Mechanical Maintenance Technician to maintain and repair industrial machinery and equipment in Spain.

**Key Responsibilities:**
- Perform preventive maintenance on industrial equipment
- Diagnose and repair mechanical failures
- Install and maintain mechanical systems
- Read and interpret technical manuals and schematics
- Use precision tools and measuring instruments
- Maintain maintenance records and documentation
- Order parts and manage inventory
- Follow safety protocols and procedures
- Collaborate with production and engineering teams
- Train operators on equipment operation and maintenance

**Required Qualifications:**
- Technical diploma in Mechanical Engineering or related field
- Minimum 4 years of experience in industrial maintenance
- Strong mechanical aptitude and troubleshooting skills
- Knowledge of hydraulic, pneumatic, and mechanical systems
- Ability to read technical drawings and schematics
- Physical ability to work in industrial environment
- Excellent problem-solving abilities
- Fluent in Spanish; English language skills beneficial
- Safety certifications preferred

**What We Offer:**
- Competitive salary with shift differentials
- Health insurance and social security benefits
- Comprehensive training on advanced equipment
- Modern manufacturing facility
- Support for work permits and integration
- Tool allowance and professional development
- Stable employment with career growth
- Overtime opportunities`,
    salary: '€2,500 - €3,300/month',
    location: 'Barcelona, Spain',
    requiredExperience: '4+ years',
    requiredLanguage: 'Spanish, English',
    workType: 'full-time',
  },
  {
    title: 'Food Production Supervisor',
    description: `Join our food production team in Italy! We are looking for an experienced Food Production Supervisor to oversee food manufacturing operations and ensure quality and safety standards.

**Key Responsibilities:**
- Supervise food production operations and production teams
- Ensure compliance with food safety regulations (HACCP, ISO 22000)
- Monitor production quality and implement quality control measures
- Manage production schedules and meet production targets
- Train production staff on procedures and safety protocols
- Maintain production records and documentation
- Coordinate with quality control and logistics teams
- Implement process improvements to increase efficiency
- Ensure proper storage and handling of food products
- Conduct regular inspections and audits

**Required Qualifications:**
- Bachelor's degree in Food Science, Food Technology, or related field
- Minimum 4 years of experience in food production or manufacturing
- Strong knowledge of food safety regulations (HACCP, ISO 22000)
- Excellent leadership and team management skills
- Understanding of food production processes and equipment
- Ability to work in food production environment
- Fluent in Italian; English language skills required
- Food safety certifications preferred

**What We Offer:**
- Competitive salary with performance bonuses
- Health insurance and social security benefits
- Professional development opportunities
- Modern food production facility
- Support for work permits and visa processing
- Accommodation assistance
- Career advancement opportunities
- Stable employment in growing industry`,
    salary: '€2,800 - €3,600/month',
    location: 'Rome, Italy',
    requiredExperience: '4+ years',
    requiredLanguage: 'Italian, English',
    workType: 'full-time',
  },
  {
    title: 'Plumber - Commercial & Residential',
    description: `We are seeking an experienced Plumber to provide plumbing services for commercial and residential properties in Poland.

**Key Responsibilities:**
- Install, maintain, and repair plumbing systems
- Diagnose plumbing problems and provide solutions
- Install fixtures, pipes, and water heaters
- Perform pipe fitting and soldering
- Read and interpret blueprints and technical drawings
- Ensure compliance with building codes and regulations
- Maintain tools and equipment
- Provide customer service and explain work performed
- Prepare cost estimates for plumbing projects
- Follow safety protocols and procedures

**Required Qualifications:**
- Plumbing license or certification
- Minimum 5 years of experience in plumbing
- Strong knowledge of plumbing systems and codes
- Ability to read blueprints and technical drawings
- Physical ability to work in various environments
- Excellent problem-solving and diagnostic skills
- Valid driver's license
- Fluent in Polish; English language skills beneficial
- Safety certifications preferred

**What We Offer:**
- Competitive salary with performance bonuses
- Company vehicle or transportation allowance
- Health insurance and social security benefits
- Tool allowance and equipment support
- Ongoing training and professional development
- Support for work permits and integration
- Stable employment with career growth
- Employee benefits and discounts`,
    salary: '€2,400 - €3,200/month',
    location: 'Krakow, Poland',
    requiredExperience: '5+ years',
    requiredLanguage: 'Polish, English',
    workType: 'full-time',
  },
  {
    title: 'Production Line Operator',
    description: `Join our manufacturing team in Sweden! We are looking for Production Line Operators to operate and monitor automated production equipment in our modern manufacturing facility.

**Key Responsibilities:**
- Operate and monitor production line equipment
- Ensure production targets are met while maintaining quality
- Perform quality checks and inspections
- Troubleshoot equipment issues and make adjustments
- Follow production procedures and safety protocols
- Maintain production records and documentation
- Collaborate with team members and supervisors
- Maintain clean and organized work area
- Report equipment issues and maintenance needs
- Participate in continuous improvement initiatives

**Required Qualifications:**
- High school diploma or equivalent
- Minimum 2 years of experience in manufacturing or production
- Ability to operate production equipment
- Basic mechanical aptitude
- Attention to detail and quality focus
- Ability to work in fast-paced environment
- Physical ability to stand for extended periods
- Ability to work in shifts including nights and weekends
- Fluent in Swedish or English
- Willingness to learn and adapt

**What We Offer:**
- Competitive hourly wage with shift differentials
- Health insurance and social security benefits
- Comprehensive training programs
- Modern manufacturing facility
- Support for accommodation and integration
- Career development opportunities
- Stable employment with long-term prospects
- Employee benefits and discounts`,
    salary: '€2,200 - €2,800/month',
    location: 'Gothenburg, Sweden',
    requiredExperience: '2-3 years',
    requiredLanguage: 'Swedish, English',
    workType: 'full-time',
  },
];

async function createZERCompanyJobs() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable bulunamadı!');
      console.error('❌ backend/.env dosyasında MONGO_URI tanımlı olmalı.');
      process.exit(1);
    }
    
    console.log('🔌 MongoDB bağlanıyor...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('🏢 ZER COMPANY İŞ İLANLARI OLUŞTURULUYOR');
    console.log('═══════════════════════════════════════════════════════\n');

    // ZER company kullanıcısını bul
    const zerCompany = await User.findOne({ email: 'zer.company@prestalink.app' });
    if (!zerCompany) {
      console.error('❌ ZER company kullanıcısı bulunamadı!');
      console.error('❌ Önce ZER company profilini oluşturun.');
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log(`✅ ZER company bulundu: ${zerCompany.companyName}\n`);

    // İş ilanlarını oluştur
    const createdJobs = [];
    for (let i = 0; i < jobListings.length; i++) {
      const jobData = jobListings[i];
      
      // Aynı iş ilanı zaten var mı kontrol et
      const existingJob = await Job.findOne({ 
        title: jobData.title, 
        location: jobData.location,
        employerId: zerCompany._id 
      });

      if (existingJob) {
        console.log(`⚠️  ${i + 1}. ${jobData.title} - ${jobData.location} (Zaten mevcut, güncelleniyor...)`);
        Object.assign(existingJob, jobData);
        existingJob.employerId = zerCompany._id;
        await existingJob.save();
        createdJobs.push(existingJob);
      } else {
        const job = await Job.create({
          ...jobData,
          employerId: zerCompany._id,
        });
        createdJobs.push(job);
        console.log(`✅ ${i + 1}. ${job.title} - ${job.location}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ İŞLEM TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`📊 Toplam ${createdJobs.length} adet iş ilanı oluşturuldu/güncellendi`);
    console.log(`🏢 İşveren: ${zerCompany.companyName}`);
    console.log(`📧 Email: ${zerCompany.email}\n`);

    // İstatistikler
    const jobCount = await Job.countDocuments({ employerId: zerCompany._id });
    console.log(`📈 ZER company toplam iş ilanı sayısı: ${jobCount}\n`);

    await mongoose.connection.close();
    console.log('✅ İşlem tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('❌ Stack:', error.stack);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

createZERCompanyJobs();

