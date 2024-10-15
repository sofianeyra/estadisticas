import React from 'react';
import PrecioCard from './../card/PrecioCard';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.BASE_URL = "https://670ec8613e7151861655c338.mockapi.io/hoteles/hotels";
            this.chartRef = null;
            this.state = {
                content: [],
                currentPage: 1,
                itemsPerPage: 15,
                cuantos: '-',
                ok: "",
                hotels: '-',
                search: '',
                sortOrder: 'asc',
                initValue: 0,
                dataSource : {
                    "chart": {
                        "caption": "Estadisticas de registros cargados",
                        "subCaption": "",
                        "xAxisName": "Hora Local",
                        "yAxisName": "Cuantos Hoteles",
                        "numberPrefix": "Total: ",
                        "refreshinterval": "2",
                        "slantLabels": "1",
                        "numdisplaysets": "10",
                        "labeldisplay": "rotate",
                        "showValues": "0",
                        "showRealTimeValue": "0",
                        "theme": "fusion"    
                    },
                    "categories": [{
                        "category": [{
                            "label": this.clientDateTime().toString()
                        }]
                    }],
                    "dataset": [{
                        "data": [{
                            "value": 0
                        }]
                    }]
                }
            };
            this.chartConfigs = {
                type: 'realtimeline',
                renderAt: 'container',
                width: '100%',
                height: '350',
                dataFormat: 'json'
        };
    }

    componentDidMount() {
        this.getDataFor("cuantos");
        this.getDataFor("ok");
        this.getDataFor("hotels");
    }

    handlePageChange = (pageNumber) => {
      this.setState({ currentPage: pageNumber });
    }

    handleSearchChange = (event) => {
      this.setState({ search: event.target.value, currentPage: 1 }); // Reiniciar a la página 1 en cada búsqueda
    };

    handleSortChange = (event) => {
      this.setState({ sortOrder: event.target.value });
    };

    getDataFor(prop) {
        fetch(this.BASE_URL, {
            mode: 'cors',
            
        })
        .then(res => res.json())
        .then(d => {
            if(prop === "cuantos"){
                const dataSource = this.state.dataSource;
                dataSource.chart.yAxisMaxValue = parseInt(d.length)
                dataSource.chart.yAxisMinValue = parseInt(d.length)
                dataSource.dataset[0]["data"][0].value = d.length;
                this.setState({
                    dataSource: dataSource,
                    initValue: d.length
                });
            }
            this.setState({
                cuantos: d.length,
                hotels: d.stars,
                content: d
            });
        });
    }

    static addLeadingZero(num){
        return num <=  9 ? "0" + num:num;
    }

    clientDateTime() {
        var date_time = new Date();
        var curr_hour = date_time.getHours();
        var zero_added_curr_hour = Body.addLeadingZero(curr_hour);
        var curr_min = date_time.getMinutes();
        var curr_sec = date_time.getSeconds();
        var curr_time = zero_added_curr_hour + ":" + curr_min + ":" + curr_sec;
        return curr_time;
      }
      getChartRef(chart) {
        this.chartRef = chart;
      }
      render() {
        let { content, currentPage, itemsPerPage, search, sortOrder } = this.state;

        // Filtrar los elementos según el término de búsqueda
        let filteredItems = content.filter(item =>
          item.name && item.name.toLowerCase().includes(search.toLowerCase())
        );

        // Ordenar los elementos filtrados
        if (sortOrder === 'asc') {
          filteredItems.sort((a, b) => a.name.localeCompare(b.name)); // A - Z
        } else if (sortOrder === 'desc') {
          filteredItems.sort((a, b) => b.name.localeCompare(a.name)); // Z - A
        }
      
        // Calcular los índices de los elementos a mostrar
        let indexOfLastItem = currentPage * itemsPerPage;
        let indexOfFirstItem = indexOfLastItem - itemsPerPage; 
        let currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem); 
        let totalPages = Math.ceil(filteredItems.length / itemsPerPage);

      return (
          <div className="row mt-5 mt-xs-4">
            <div className="col-12 mb-3">
              <div className="card-deck custom-card-deck">
              <div className="card mr-0 custom-card mb-4">
                <div className="card-body">
                      <h5 className="card-title mb-4">Buscador</h5>
                      <div className='input-group'>
                        <input 
                        type='search' 
                        className="form-control" 
                        placeholder='Buscar por nombre...'
                        value={search}
                        onChange={this.handleSearchChange}/>
                        <select 
                          className="form-select" 
                          aria-label="orden" 
                          value={sortOrder}
                          onChange={this.handleSortChange}
                        >
                          <option selected>Ordenar por:</option>
                          <option value="1">A - Z</option>
                          <option value="2">Z - A</option>
                        </select>
                       
                      </div>
                  </div>  
              </div>
              <div className='row gx-3 gy-3'>
                {currentItems.length > 0 ? (
                  currentItems.map((e, index) => (
                    <div className="col-12 col-md-4" key={index}>
                       <PrecioCard
                        header={e.name}
                        src={e.image}
                        alt={e.name}
                        label={e.phone}
                        value={e.address}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12">No se encontraron resultados.</div> // Mensaje si no hay resultados
                )}
              
              </div> 
              </div>
            </div>
           
            {/* Paginación */}
            <div className="pagination justify-content-center m-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => this.handlePageChange(i + 1)}
                  className={`btn btn-primary mx-1 ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        );
      }
}

export default Body;