import { 
  FormHeader, 
  FormDescription, 
  FormSection, 
  FormGrid, 
  FormInput,
} from '../shared/FormComponents';

function ContactInformationForm({ formData, handleInputChange }) {
  return (
    <div>
      <FormHeader title="Contact information" />
      
      <FormDescription>
        Including your contacts in your resume is crucial so potential employers can easily get in touch with you.
      </FormDescription>
      
      <FormSection>
        <FormGrid columns={2}>
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john@example.com"
          />
          <FormInput
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 999 888 7777"
          />
        </FormGrid>

        <FormGrid columns={2}>
          <FormInput
            label="Location"
            hint={{
              title: "Location (City, State)",
              description: "We recommend putting the closest big city vs smaller towns that people likely won't recognize."
            }}
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="San Diego, CA"
          />
          <FormInput 
            label="Porfolio"
            hint={{
              title: "Portfolio Link",
              description: "We don't recommend linking your LinkedIn because it opens you up to screeners' visual biases and possible discrimination, and the information on your LinkedIn should match your resume anyway – be sure to update your LI though after this process, so when you apply for roles on LinkedIn, it's just as impressive as your resume."
            }}
            type="url"
            value={formData.portfolio}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            placeholder="https://davidguerrero.co/"
          />
        </FormGrid>
      </FormSection>
    </div>
  );
}


export default ContactInformationForm;