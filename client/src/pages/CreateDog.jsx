

export const CreateDog = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a new Dog</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder="Name" className="border p-3 rounded-lg" id='name' maxLength='62' minLength='10' required />
          <input type="text" placeholder="Height" className="border p-3 rounded-lg" id='height' maxLength='62' minLength='10' required />
          <input type="text" placeholder="Weight" className="border p-3 rounded-lg" id='weight' maxLength='62' minLength='10' required />
          <input type="text" placeholder="Life span" className="border p-3 rounded-lg" id='life_span' maxLength='62' minLength='10' required />
          <input type="text" placeholder="Origin" className="border p-3 rounded-lg" id='origin' maxLength='62' minLength='10' required />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold text-slate-600 ml-3">Images:
            <span className="font-normal text-slate-500 ml-2">The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input className="p-2 text-slate-500 rounded w-full" type="file" id='images' accept="image/*" multiple />
            <button className="bg-slate-600 text-white p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-80">Upload</button>
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-4 flex-1">
        <button className="bg-slate-600 max-w-full text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 my-5">Create Dog</button>
      </div>
    </main>
  )
}
