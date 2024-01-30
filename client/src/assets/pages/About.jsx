import logo from "./../../../public/logo.png";
export default function About() {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <img
        className="mx-auto mb-4
      "
        src={logo}
        alt=""
      />
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        Elite Estate Solutions
      </h1>
      <p className="mb-4 text-slate-700">
        At Elite Estate Solutions, we take pride in being a leading real estate
        agency, specializing in assisting clients with buying, selling, and
        renting properties in the most sought-after neighborhoods. Our team of
        seasoned agents is dedicated to delivering exceptional service, ensuring
        a smooth and seamless process for our clients.
      </p>
      <p className="mb-4 text-slate-700">
        Our mission is clear: to help clients achieve their real estate goals
        through expert advice, personalized service, and an in-depth
        understanding of the local market. Whether you`re looking to buy, sell,
        or rent a property, we are here to guide you at every step.
      </p>
      <p className="mb-4 text-slate-700">
        Backed by a wealth of experience and knowledge in the real estate
        industry, our team is committed to providing the highest level of
        service. We believe that the process of buying or selling a property
        should be an exciting and rewarding experience, and we are devoted to
        making that a reality for each and every one of our clients.
      </p>
    </div>
  );
}
