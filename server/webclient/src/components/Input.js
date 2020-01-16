import React from 'react';

export default class Input extends React.PureComponent {
    getIconMarkup() {
        if (this.props.icon) {
            return <span className="icon is-small is-left">
                {this.props.icon ? this.props.icon : ""}
            </span>
        }
        return "";
    }
    render() {
        return (
            <div className="field">
                <p className={"control has-icons-left has-icons-right"}>
                    <input
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        className={"input"}
                        type={this.props.type}
                        placeholder={this.props.placeholder}
                        name={this.props.name}
                        value={this.props.value}
                    />
                    {this.getIconMarkup()}
                </p>
            </div>
        );
    }
}