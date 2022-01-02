// https://observablehq.com/@akxsha/electric-consumption-and-co2-emissions@662
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["CO2.csv",new URL("./files/d7d391c1a2b2c7121a0dc034760cb60130068911464f68550f9fab3d20b6e8d0d0d2c8b1c337c85ac87c05c3da52f69f044b19dbc1055f0677d753dfc7e63e32",import.meta.url)],["data2.json",new URL("./files/6077b0722d7dc91acdd829b110b6a040c6b45703eafc13f562f7f662e63e55a0ef608469289d41cb3de295c51d03511ec38fc61ec49f91f670500730e8232c36",import.meta.url)],["Electric.csv",new URL("./files/34688f0bad0def39e89e65fef12f78ee80fef4a4ccc0a61510cf90a5735fdb9426e4739854c5719aefbeeb2443d4edf256626d8743874cfa191554ba83ca1650",import.meta.url)],["cleaned_data.json",new URL("./files/ade59dc087cf552f81c257ed68ab1faad0f140053845e03c8e6ce4c630b272511db1c897b725381fccbc3f8cbe325ef0ae4b984e4af41f523073ba5177d16dea",import.meta.url)],["unpivoted_convertcsv@1.csv",new URL("./files/41d43dcbd85d794eb1622cb1f615feb37858a62f1b566f3fefb492c4c2e18e1430488c92b5e7c2d810192380ace423b4ba900b4d4fd55d521eadc135d5eee7ef",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Electric Consumption and CO2 Emissions`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data Source
### The World Bank
To create this visual, we selected data from The World Bank Indicators Website.
Co2 Emissions: https://data.worldbank.org/indicator/EN.ATM.CO2E.PC?view=chart
Electric Consumption: https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC?view=chart
 Renewable Energy: data here`
)});
  main.variable(observer("Data")).define("Data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("data2.json").json()
)});
  main.variable(observer("newData")).define("newData", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("cleaned_data.json").json()
)});
  main.variable(observer("newDataPivoted")).define("newDataPivoted", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("unpivoted_convertcsv@1.csv").csv()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# The Initial Question
With climate change becoming an increasingly important issue people around the globe are now wondering what causes CO2 emissions to rise. One popular theory is that increasing electricity consumption leads to more CO2 emissions as it means countries are using more natural resources which leads to more CO2 emissions. Others argue that increasing electricity consumption leads to less CO2 emissions since it means that countries are using more green forms of energy as opposed to more harmful forms of energy which lead to more CO2 emissions. `
)});
  main.variable(observer("countries")).define("countries", function(){return(
["United States","Australia","Belgium","Switzerland","Denmark","Greece","Mexico","Thailand"]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We chose 9 countries at random from a range of continents to see how these values change internationally. We tracked their electric consumption and Co2 Emissions over a 60-year period.`
)});
  main.variable(observer()).define(["vl","countries","Data"], function(vl,countries,Data)
{
  const brush = vl.selectInterval().encodings("x");
    const selectCountry = vl.selectPoint('Select') // name the selection 'Select'
    .fields('country_name')          // limit selection to the country_name field
    .init({Country_name: countries[0]}) // use first genre entry as initial value
    .bind(vl.menu(countries));         // bind to a menu of unique genre values
  
  // const hover = vl.selectSingle().nearest(true).on("mousemove").fields("country_name").empty("none")
  
  const Electriclines = vl.markLine({size:0.4,point:true}).title("Electric Consumption").select(brush)
    .encode(
      // vl.opacity().value(0).if(hover,vl.value(1)),
      vl.x().fieldT("year").title("Year"),
      vl.y().fieldQ("electric_consumption").title("Electric Consumption"),
      vl.color().value("lightgray").if(brush,vl.color().fieldN("country_name")).title("Country"),
      vl.tooltip(['country_name', 'electric_consumption', 'year']),
      vl.detail().fieldN("country_name")
  ).width(600)

  const C02Lines=vl.markLine({size:0.4,point:true}).title("Co2 Emissions")
    .transform(vl.filter(brush))
    .encode(
      vl.x().fieldT("year").title("Year"),
      vl.y().fieldQ("C02Emissions").title("C02 Emissions"),
      vl.color().fieldN("country_name").title("Country"),
      vl.tooltip(['country_name', 'C02Emissions', 'year']),
      vl.detail().fieldN("country_name")
  ).width(600)
  
    return vl.vconcat(Electriclines,C02Lines).data(Data)
  .render()
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`We found that for all 9 countries, electric consumption increased, but we begin to see a plateau starting in the year 2000.

Co2 emissions have stayed relatively consistent compared to electric consumption, changing only 5 to 10 units over 60 years, and have decreased in the last 20 years. There could be many reasons behind this phenomenon; electric cars, an increase in tree planting, or even better laws to track Co2 and create rules and goals for carbon neutrality.

To create this visual, we selected data from The World Bank Indicators Website. We felt that a scatter plot with a line to link the countries was the best way to represent this data as it changes over time. 

We then selected the tooltip and brushing tool as our interactions of choice. To activate the tooltip, hover your mouse over any data point for more information. To interact with the brushing feature, select a range of dates in the Electric Consumption visual to see the Co2 Emissions table filter to this range of years. 

To achieve these interactions, we used the VegaLite encoding functionality for the brush and hover. 

We felt that these would be the best interactions for several reasons. The tooltip was ideal because we can see other key information without crowding the original visual. The brush feature allows a user to filter data and was ideal because you can see the detailed changes over time. 

We considered a zoom interaction initially but found it wasn't as useful as the brush and linking feature due to the fact it could only focus on 1 dimension at a time. With brush and linking the user could analyze two dimensions, C02 and electricity, much easier and see the correlation between them in greater detail.
`
)});
  main.variable(observer("ElectricCSV")).define("ElectricCSV", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("Electric.csv").csv({typed: true})
)});
  main.variable(observer("CO2CSV")).define("CO2CSV", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("CO2.csv").csv({typed: true})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Part 2: How much Renewable energy do these countries use?
#### Dennis you can change this`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`original questions: 
- static visual: how does electric consumption compare to renewable and other energies bc we had that data
- interactive: how does co2 emissions compare for countries using more renewables?
w/ a button filter or a linking filter where it filters based on if they use renewables or not`
)});
  main.variable(observer("viewof simpleBar")).define("viewof simpleBar", ["vl","newData"], function(vl,newData){return(
vl.markArea().title('Renewable Energy Consumption') // Make a bar chart
  .data(newData)               
  .encode(
    vl.x().fieldT("year").title('Country'), // .sort(vl.fieldQ("frequency").order("descending")) are ordinal on the x-axis
    vl.y().fieldQ("renewable_energy_percent_consume").title('Renewable Energy Consumed'), // Frequency on the y-axis, formatted as percent
    vl.color().fieldN("country_name").title('Country'), // .sort(vl.fieldQ("frequency").order("descending")) are ordinal on the x-axis

  )
  .width(500)
  .height(300)
  .render()
)});
  main.variable(observer("simpleBar")).define("simpleBar", ["Generators", "viewof simpleBar"], (G, _) => G.input(_));
  main.variable(observer()).define(["vl","countries","newDataPivoted"], function(vl,countries,newDataPivoted)
{
  const isCountry = vl.selectPoint('Select')
  .fields('country_name')
  .init({country_name: countries[0]})
  .bind(vl.menu(countries));

  return vl.markArc().title('CO2 Emissions by Main Energy Source')
  .data(newDataPivoted)
  .params(isCountry)
  .transform(vl.filter(isCountry)
      )
  
  .encode(
   // vl.x().fieldT("year"),
    vl.theta().sum("Value"),
    //vl.theta().sum("Value"),
    vl.color().fieldN("Attribute").title('Energy Type'),


  )
  .width(500)
  .height(300)
    .render()
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`How work was divided up:
#### Akasha:  Created static and interactive visualization 
#### Dennis:  Analysis and documentation
#### Sharon:  Located, cleaned, and prepared the data
`
)});
  return main;
}
