import PropTypes from 'prop-types';
import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  formControls = [],
  formData,
  setFormData,
  handleSubmit,
  buttonText,
  isButtonDisabled = false
}) {
  return (
    <form onSubmit={handleSubmit}>
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      ></FormControls>
      <Button disabled={isButtonDisabled} type="submit" className='mt-5 w-full' >{buttonText || "Submit"}</Button>
    </form>
  );
}

CommonForm.propTypes = {
  formControls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      componentType: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      )
    })
  ),
  formData: PropTypes.object.isRequired, // formData should be an object
  setFormData: PropTypes.func.isRequired, // setFormData is a function
  handleSubmit: PropTypes.func.isRequired, // handleSubmit is a function
  buttonText: PropTypes.string, // buttonText is a string
  isButtonDisabled: PropTypes.bool // isButtonDisabled is a boolean
};

export default CommonForm;
