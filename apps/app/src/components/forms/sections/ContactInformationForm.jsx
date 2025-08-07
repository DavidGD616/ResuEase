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

        <FormGrid columns={2}>
          <FormInput
            label="Country"
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="USA"
          />
          <FormInput
            label="City"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Austin"
          />
        </FormGrid>

        <FormGrid columns={2}>
          <FormInput
            label="Address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="500 W 2nd St"
          />
          <FormInput
            label="Postal code"
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="55912"
          />
        </FormGrid>
      </FormSection>
    </div>
  );
}


export default ContactInformationForm;