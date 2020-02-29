import React from 'react';
import {Table, Icon, Tooltip} from 'antd';
import CellNode from './cellNode';
import 'antd/dist/antd.css';

class BaseTable extends React.Component {

    constructor(props) {
        super(props);

        this._row_error_key = '_row';

        this.final = this.props.columns.children ? false : true;

        this.renderCell = this.renderCell.bind(this);
        this.expandedRowRender = this.expandedRowRender.bind(this);
        this.updateState = this.updateState.bind(this);
        this.commonChange = this.commonChange.bind(this);
        this.updateBaseProp = this.updateBaseProp.bind(this);
    }

    updateBaseProp() {
        this.columns = this.props.columns.data.map(col => {
            return {
                title: col.title,
                dataIndex: col.key,
                key: col.key,
                render: this.renderCell(col)
            }
        });
        this.dataSource = this.props.row_data.map((col, idx) => {
            const dataSource = col.data;
            dataSource.key = idx;
            return dataSource;
        });
    }

    renderCell(colSetting) {
        return (text, record, index) => {
            let row_error_tips;
            let cell_error_tips;
            if (colSetting.key == this.props.columns.data[0].key
                && typeof this.props.row_data[index].error != "undefined"
                && typeof this.props.row_data[index].error[this._row_error_key] != "undefined") {
                row_error_tips = true
            }

            if (typeof this.props.row_data[index].error != "undefined" && typeof this.props.row_data[index].error[colSetting.key] != "undefined") {
                cell_error_tips = true;
            }


                return (
                    <div>
                        { row_error_tips &&
                        <Tooltip title={this.props.row_data[index].error[this._row_error_key]}>
                            <Icon style={{marginRight: 5}} type="warning" theme="twoTone" twoToneColor="#df0000"/>
                        </Tooltip>
                        }
                        <CellNode text={text} index={index} colsetting={colSetting} topchange={this.commonChange}
                                  style={{width: '90%'}}/>
                        { cell_error_tips &&
                            <Tooltip title={this.props.row_data[index].error[colSetting.key]}>
                                <Icon style={{marginLeft: 5}} type="warning" theme="twoTone" twoToneColor="#df0000"/>
                            </Tooltip>
                        }
                    </div>
                );

        };
    }


    commonChange(val, index, columnName) {
        this.props.row_data[index].data[columnName] = val;
        this.updateState(this.props.row_data, 0, true);
        this.updateBaseProp();
    }

    updateState(data, parentIdx, current = false) {
        if (!current) {
            this.props.row_data[parentIdx].children = data;
        }
        this.props.updatestate(this.props.row_data, this.props.parentIdx);
    }

    expandedRowRender(record, index) {
        if (typeof this.props.row_data[index].children == 'undefined') {
            return false;
        } else {
            return <BaseTable columns={this.props.columns.children} row_data={this.props.row_data[index].children}
                              parentIdx={index} updatestate={this.updateState}/>
        }

    }


    render() {
        this.updateBaseProp();
        return <Table columns={this.columns} dataSource={this.dataSource} expandedRowRender={this.expandedRowRender}
                      pagination={false} defaultExpandAllRows={true}/>
    }
}

export default BaseTable;