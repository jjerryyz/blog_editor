// Import React!
import React from 'react'
import { Editor } from 'slate-react'
import Html from 'slate-html-serializer'

// theme
import './github-markdown.css'

// block-code editor
import '../node_modules/codemirror/lib/codemirror.css'
import CodeMirror from '../node_modules/codemirror/lib/codemirror.js'
import "../node_modules/codemirror/mode/javascript/javascript.js"
import "../node_modules/codemirror/addon/merge/merge.js"

// custom
import './App.css'


const BLOCK_TAGS = {
    blockquote: 'block-quote',
    pre: 'block-code',
    p: 'paragraph',
    h1: 'heading-one',
    h2: 'heading-two',
    h3: 'heading-three',
    h4: 'heading-four',
    h5: 'heading-five',
    h6: 'heading-six',
    ul: 'bulleted-list',
    li: 'list-item',
}

// const MARK_TAGS = {
//     em: 'italic',
//     strong: 'bold',
//     u: 'underline',
// }

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
                    case 'block-quote':
                        return <blockquote>{children}</blockquote>
                    case 'block-code':
                        return <pre><code>{children}</code></pre>
                    case 'heading-one':
                        return <h1>{children}</h1>
                    case 'heading-two':
                        return <h2>{children}</h2>
                    case 'heading-three':
                        return <h3>{children}</h3>
                    case 'heading-four':
                        return <h4>{children}</h4>
                    case 'heading-five':
                        return <h5>{children}</h5>
                    case 'heading-six':
                        return <h6>{children}</h6>
                    default:
                        return <p></p>
                }
            }
        },
    },
    // handle mark
    // {
    //     deserialize(el, next) {
    //         const type = MARK_TAGS[el.tagName.toLowerCase()]
    //         if (type) {
    //             return {
    //                 object: 'mark',
    //                 type: type,
    //                 nodes: next(el.childNodes),
    //             }
    //         }
    //     },
    //     serialize(obj, children) {
    //         if (obj.object == 'mark') {
    //             switch (obj.type) {
    //                 case 'bold':
    //                     return <strong>{children}</strong>
    //                 case 'italic':
    //                     return <em>{children}</em>
    //                 case 'underline':
    //                     return <u>{children}</u>
    //             }
    //         }
    //     },
    // }
]

const html = new Html({ rules })

const initialValue = localStorage.getItem('content') || '<p>输入文本</p>'

// Define our app...
class App extends React.Component {

    // Set the initial value when the app is first constructed.
    state = {
        value: html.deserialize(initialValue),
    }

    constructor(props) {
        super(props)
        this.codeMirrorContainer = React.createRef()
    }

    // Render the editor.
    render() {
        return <div className="App markdown-body" >
            <div className="" ref={this.codeMirrorContainer}></div>
            <Editor value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                renderBlock={this.renderBlock} />
        </div>
    }

    componentDidMount() {
        CodeMirror.MergeView(this.codeMirrorContainer.current, {
            value: 'function test() { 1 + 1 \n}',
            mode: 'javascript',
            lineNumbers: true
        });
    }

    getType = chars => {
        switch (chars) {
            case '*':
            case '-':
            case '+':
                return 'list-item'
            case '>':
                return 'block-quote'
            case '#':
                return 'heading-one'
            case '##':
                return 'heading-two'
            case '###':
                return 'heading-three'
            case '####':
                return 'heading-four'
            case '#####':
                return 'heading-five'
            case '######':
                return 'heading-six'
            case '```':
                return 'block-code'
            default:
                return null
        }
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        if (value.document != this.state.value.document) {
            const string = html.serialize(value)
            localStorage.setItem('content', string)
        }
        this.setState({ value })
    }

    onKeyDown = (event, editor, next) => {
        switch (event.key) {
            case ' ':
                return this.onSpace(event, editor, next)
            case 'Backspace':
                return this.onBackspace(event, editor, next)
            case 'Enter':
                return this.onEnter(event, editor, next)
            default:
                return next()
        }
    }

    onSpace = (event, editor, next) => {
        const { value } = editor
        const { selection } = value
        // range 是否处于收缩状态，意思是start和end处于同一个点，选中为空
        if (selection.isExpanded) return next()

        const { startBlock } = value
        const { start } = selection
        const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')
        const type = this.getType(chars)
        if (!type) return next()
        if (type === 'list-item' && startBlock.type === 'list-item') return next()
        event.preventDefault()

        editor.setBlocks(type)

        if (type === 'list-item') {
            editor.wrapBlock('bulleted-list')
        }

        editor.moveFocusToStartOfNode(startBlock).delete()
    }

    onBackspace = (event, editor, next) => {
        const { value } = editor
        const { selection } = value
        if (selection.isExpanded) return next()
        if (selection.start.offset !== 0) return next()

        const { startBlock } = value
        if (startBlock.type === 'paragraph') return next()

        event.preventDefault()
        editor.setBlocks('paragraph')

        if (startBlock.type === 'list-item') {
            editor.unwrapBlock('bulleted-list')
        }
    }

    onEnter = (event, editor, next) => {
        const { value } = editor
        const { selection } = value
        const { start, end, isExpanded } = selection
        if (isExpanded) return next()

        const { startBlock } = value
        if (start.offset === 0 && startBlock.text.length === 0)
            return this.onBackspace(event, editor, next)
        if (end.offset !== startBlock.text.length) return next()

        if (
            startBlock.type !== 'heading-one' &&
            startBlock.type !== 'heading-two' &&
            startBlock.type !== 'heading-three' &&
            startBlock.type !== 'heading-four' &&
            startBlock.type !== 'heading-five' &&
            startBlock.type !== 'heading-six' &&
            startBlock.type !== 'block-quote'
        ) {
            return next()
        }

        event.preventDefault()
        editor.splitBlock().setBlocks('paragraph')
    }

    renderBlock = (props, editor, next) => {
        const { attributes, children, node } = props
        switch (node.type) {
            case 'block-code':
                return <pre {...attributes}><code>{children}</code></pre>
            case 'paragraph':
                return <p {...attributes} className={node.data.get('className')}>{children}</p>
            case 'block-quote':
                return <blockquote {...attributes}>{children}</blockquote>
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>
            case 'heading-one':
                return <h1 {...attributes}>{children}</h1>
            case 'heading-two':
                return <h2 {...attributes}>{children}</h2>
            case 'heading-three':
                return <h3 {...attributes}>{children}</h3>
            case 'heading-four':
                return <h4 {...attributes}>{children}</h4>
            case 'heading-five':
                return <h5 {...attributes}>{children}</h5>
            case 'heading-six':
                return <h6 {...attributes}>{children}</h6>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            default:
                return next()
        }
    }
}

export default App