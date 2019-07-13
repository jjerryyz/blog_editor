// Import React!
import React from 'react'
import { Editor } from 'slate-react'
// import { Value } from 'slate'
// import Plain from 'slate-plain-serializer'
import Html from 'slate-html-serializer'

const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
}

const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
}

const rules = [
    // handle block
    {
        deserialize(el, next) {
            const type = BLOCK_TAGS[el.tagName.toLowerCase()]
            if (type) {
                return {
                    object: 'block',
                    type: type,
                    data: {
                        className: el.getAttribute('class'),
                    },
                    nodes: next(el.childNodes), // 递归的解析子节点
                }
            }
        },
        serialize(obj, children) {
            if (obj.object == 'block') {
                switch (obj.type) {
                    case 'paragraph':
                        return <p className={obj.data.get('className')}>{children}</p>
                    case 'quote':
                        return <blockquote>{children}</blockquote>
                    case 'code':
                        return (
                            <pre>
                                <code>{children}</code>
                            </pre>
                        )
                }
            }
        },
    },
    // handle mark
    {
        deserialize(el, next) {
            const type = MARK_TAGS[el.tagName.toLowerCase()]
            if (type) {
                return {
                    object: 'mark',
                    type: type,
                    nodes: next(el.childNodes),
                }
            }
        },
        serialize(obj, children) {
            if (obj.object == 'mark') {
                switch (obj.type) {
                    case 'bold':
                        return <strong>{children}</strong>
                    case 'italic':
                        return <em>{children}</em>
                    case 'underline':
                        return <u>{children}</u>
                }
            }
        },
    }
]

const html = new Html({ rules })

const initialValue = localStorage.getItem('content') || '<p></p>'

function MarkHotKey(options) {
    const { type, key } = options

    return {
        onKeyDown(event, editor, next) {
            // If it doesn't match our `key`, let other plugins handle it.
            if (!event.ctrlKey || event.key != key) return next()

            // Prevent the default characters from being inserted.
            event.preventDefault()

            // Toggle the mark `type`.
            editor.toggleMark(type)
        },
    }
}

function BlockHotKey(options) {
    const { type, key } = options

    return {
        onKeyDown(event, editor, next) {
            // If it doesn't match our `key`, let other plugins handle it.
            if (!event.ctrlKey || event.key != key) return next()

            // Prevent the default characters from being inserted.
            event.preventDefault()

            const isType = editor.value.blocks.some(block => block.type == type)

            // Toggle the mark `type`.
            editor.setBlocks(isType ? 'paragraph' : type)
        },
    }
}

const plugins = [
    MarkHotKey({ key: 'b', type: 'bold' }),
    MarkHotKey({ key: 'i', type: 'italic' }),
    MarkHotKey({ key: '~', type: 'strikethrough' }),
    MarkHotKey({ key: 'u', type: 'underline' }),
    BlockHotKey({ key: '`', type: 'code' }),
]

// Define our app...
class App extends React.Component {
    // Set the initial value when the app is first constructed.
    state = {
        value: html.deserialize(initialValue),
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        if (value.document != this.state.value.document) {
            const string = html.serialize(value)
            localStorage.setItem('content', string)
        }
        this.setState({ value })
    }

    // Render the editor.
    render() {
        return <Editor value={this.state.value}
            plugins={plugins}
            onChange={this.onChange}
            renderBlock={this.renderNode}
            renderMark={this.renderMark} />
    }

    renderNode = (props, editor, next) => {
        switch (props.node.type) {
            case 'code':
                return (
                    <pre {...props.attributes}>
                        <code>{props.children}</code>
                    </pre>
                )
            case 'paragraph':
                return (
                    <p {...props.attributes} className={props.node.data.get('className')}>
                        {props.children}
                    </p>
                )
            case 'quote':
                return <blockquote {...props.attributes}>{props.children}</blockquote>
            default:
                return next()
        }
    }

    renderMark = (props, editor, next) => {
        switch (props.mark.type) {
            case 'bold':
                return <strong>{props.children}</strong>
            case 'italic':
                return <em>{props.children}</em>
            case 'strikethrough':
                return <del>{props.children}</del>
            case 'underline':
                return <u>{props.children}</u>
            default:
                return next()
        }
    }
}

export default App