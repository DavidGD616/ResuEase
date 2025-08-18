import { 
  FormHeader, 
  FormDescription, 
  FormSection, 
  FormGrid, 
  FormInput 
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

        <FormGrid columns={1}>
          <FormInput
            label="Location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="San Diego, CA"
          />
        </FormGrid>
      </FormSection>
    </div>
  );
}


export default ContactInformationForm;