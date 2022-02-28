const Products = [];

class ProductTable extends React.Component {
    render() {
        const productRows = this.props.products.map(product => <ProductRow key={product.id} product={product}/>);
        return (
            <table className="borderedTable">
                <thead align="left">
                    <tr>
                        <th>Name of Product</th>
                        <th>Price of Product</th>
                        <th>Categories</th>
                        <th>Image of the Product</th>
                    </tr>
                </thead>
                <tbody>
                    {productRows}
                </tbody>
            </table>
        )
    }
}

class ProductRow extends React.Component {
    render() {
        const prd = this.props.product;
        return(
            <tr>
                <td>{prd.Name}</td>
                <td>${prd.Price}</td>
                <td>{prd.Category}</td>
                <td><a href={prd.Image} target="_blank">View</a></td>
            </tr>
        )
    }
}

class AddProduct extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAdd;
        var price = form.prdPrice.value;
        price = price.slice(1);
        const prd = {productName: form.prdName.value, productPrice: price, productCategory: form.prdCat.value, productImage: form.prdImg.value};
        this.props.createProduct(prd);
        form.prdName.value="";   
        form.prdPrice.value="$";
        form.prdImg.value="";
    }

    render() {
        return (
            <div>
                <form name="productAdd" className="formAdd" onSubmit={this.handleSubmit}>
                    <div>
                        <p>
                            <label>Category<br/>
                            <select id="prdCat" name="category">
                                <option value="Jeans">Jeans</option>
                                <option value="Shirts">Shirts</option>
                                <option value="Jackets">Jackets</option>
                                <option value="Sweaters">Sweaters</option>
                                <option value="Accessories">Accessories</option>
                            </select></label>
                        </p>
                        <p>
                            <label>Cost Per Unit<br/> 
                            <input type="text" name="prdPrice" defaultValue="$"/></label>
                        </p>
                        <p>
                            <input type="submit" id="btnAdd" value="Add Product"></input>
                        </p>
                    </div>
                    <div>
                        <p>
                            <label>Name of the Product<br/> 
                            <input type="text" name="prdName"/></label>
                        </p>
                        <p>
                            <label>Link to Product's Image<br/> 
                            <input type="text" name="prdImg"/></label>
                        </p>
                    </div>
                </form>
            </div>
        )
    }
}

class Product extends React.Component {
    constructor() {
        super();
        this.state = {products:[]}
        this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        const query = `query{
            productList{
                id Name Price Image Category
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        });
        const resposeResult = await response.json();
        this.setState({products: resposeResult.data.productList})
    }

    async createProduct(newProduct) {
        const query = `mutation {
            productAdd(product:{
                Name: "${newProduct.productName}",
                Price: ${newProduct.productPrice},
                Image: "${newProduct.productImage}",
                Category: ${newProduct.productCategory},
            }) {id}
        }`;
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        });
        this.loadData();
    }

    render() {
        return (
            <div id="mainDiv">
                <h1>Inventory of my Products</h1>
                <h3>Availble products:</h3>
                <hr/><br/>
                <ProductTable products={this.state.products}/>
                <h3>Add new product to the Inventory</h3>
                <hr/>
                <AddProduct createProduct={this.createProduct}/>
            </div>
        )
    }   
}
   
ReactDOM.render(<Product/>, document.getElementById('section1'));