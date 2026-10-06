import Button from "@mui/material/Button"
import InputLabel from "@mui/material/InputLabel"
import NativeSelect from "@mui/material/NativeSelect"
import TextField from "@mui/material/TextField"

const Form = ({cnt, item, setCnt, setItem, handleFormSubmit}) => {
    
  return (
  <section className="form-section" aria-label="Add an item">
    <form onSubmit={(e) => {handleFormSubmit(e)}} className="trip-form">
      <label className="form-label" htmlFor="item-quantity">Add to your packing list</label>
      <InputLabel variant="standard"></InputLabel>
      <NativeSelect sx={{width: 80, height: 48}} id="item-quantity" value={cnt} onChange={(e) => {setCnt(e.target.value)}}>
        {Array.from({length:19}, (_,i) => i+1).map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </NativeSelect>
      <TextField onChange={(e) => {setItem(e.target.value)}} label="Standard" variant="standard" value={item} placeholder='e.g. sunglasses' />
      <Button sx={{height:48}} type="submit" variant="contained">Add Item</Button>
    </form>
  </section>
  )
}

export default Form