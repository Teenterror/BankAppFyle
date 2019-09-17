import React, { Component } from 'react';
import {
    Container,
    Card,
    CardHeader,
    InputGroup,
    Input,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    InputGroupAddon,
    DropdownMenu,
    Row
  } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class BankApp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dropdownOpen: false,
            bankDetailList: [],
            listOfBranches: [],
            searchValue: '',
            branchName:'',
            tableData:[],
            filteredTableData: [],
            isSearch: false,
            rowSize: 10
         }
    }

    componentDidMount(){
        fetch("https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI")
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res);
            this.setListOfBranches(res);
            this.setBankDetail(res);
        })
    }

    setListOfBranches=(bankDetailList)=>{
        let tableData = [];
        var listOfBranches = bankDetailList.map((bank,key)=>{
            const tempDataObj ={
                address: bank.address,
                bank_id: bank.bank_id,
                bank_name: bank.bank_name,
                branch: bank.branch,
                city: bank.city,
                district: bank.district,
                ifsc: bank.ifsc,
                state: bank.state
            }
            tableData.push(tempDataObj);
            return bank.branch
        })
        this.setState({
            listOfBranches,
            tableData
        })
    }

    setBankDetail = (bankDetailList) =>{
        this.setState({
            bankDetailList
        })
    }

    toggle = () => {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
    }

    setSearchValue = (e) =>{
        const {tableData} = this.state;
        const searchValue = e.target.value;
        this.setState({
            filteredTableData: tableData.filter((data)=> 
            data.bank_name.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
            data.state.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
            data.district.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
            data.city.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
            data.address.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
            data.ifsc.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
            data.branch.toLowerCase().search(searchValue.toLowerCase()) !== -1),
            searchValue,
            isSearch: true,
        })
        if(searchValue === ''){
            this.setState({
                isSearch: false,
            })
        }
    }

    setBranch = (branchName) =>{
        this.setState({
            branchName
        })
        if(branchName !==''){
            this.setFilteredBranchData(branchName);
        } else {
            this.setFilteredData();
        }
    }

    setFilteredData = () =>{
        this.setState({
            filteredTableData:[],
            isSearch: false,
        })
    }

    setFilteredBranchData = (branchName)=>{
        const {tableData} = this.state;
        this.setState({
            filteredTableData: tableData.filter((data)=> data.branch.toLowerCase() === branchName.toLowerCase()),
            isSearch: true,
        })
    }

    // setRowSize= (e) =>{
    //     const {filteredTableData,tableData,isSearch} = this.state;
    //     var rowSize = 10;
    //     if(isSearch){
    //         rowSize = filteredTableData.length < Number(e.target.value) ? filteredTableData.length : Number(e.target.value)
    //     } else {
    //         rowSize = tableData.length < Number(e.target.value) ? tableData.length : Number(e.target.value)
    //     }
    //     console.log(rowSize)
    //     this.setState({
    //         rowSize
    //     })
    // }

    render() { 
        const { listOfBranches, branchName, tableData, filteredTableData, isSearch, rowSize } = this.state;
        var data = [];
        if (isSearch) {
            data = filteredTableData
          } else {
            data = tableData;
          }
        return ( 
            <div>
                <Container style={{paddingTop: 40}}>
                    <Card className="main-card mb-3">
                        <CardHeader className="card-header-tab" 
                        style={{display: 'flex',visibility: listOfBranches.length>0 ? 'visible' : 'hidden'}}
                        >
                            <Dropdown
                            isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle color="primary" caret>
                                    {branchName || "Branch"}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={()=>this.setBranch('')}>Select</DropdownItem>
                                    {
                                        listOfBranches.map((branch,key)=>{
                                            return <DropdownItem key={key} onClick={()=>this.setBranch(branch)}>{branch}</DropdownItem>
                                        })
                                    }
                                </DropdownMenu>
                            </Dropdown>
                            <InputGroup style={{flex: 1,marginLeft: '5px'}}>
                                <Input placeholder="Search Deck..." onChange={this.setSearchValue}/>
                            </InputGroup>
                        </CardHeader>
                    </Card>
                    <Row>
                        <InputGroup style={{margin: '15px'}}>
                                <InputGroupAddon addonType="prepend">Row Size</InputGroupAddon>
                                <Input  type="number" placeholder="Set Row Size" onChange={this.setRowSize}/>
                        </InputGroup>
                    </Row>

                    <ReactTable
                     data={data}
                     columns={[
                        {
                            Header: 'ID',
                            accessor: 'bank_id',
                        },
                        {
                          Header: 'IFSC',
                          accessor: 'ifsc',
                        },
                        {
                            Header: 'BRANCH',
                            accessor: 'branch',
                        },
                        {
                            Header: 'NAME',
                            accessor: 'bank_name',
                        },
                        {
                            Header: 'STATE',
                            accessor: 'state',
                        },
                        {
                            Header: 'DISTRICT',
                            accessor: 'district',
                        },
                        {
                            Header: 'CITY',
                            accessor: 'city',
                        },
                        {
                            Header: 'ADDRESS',
                            accessor: 'address',
                        },
                        
                      ]}
                      defaultPageSize={rowSize}
                      className="-striped -highlight"
                     />
                </Container>
            </div>
         );
    }
}
 
export default BankApp;