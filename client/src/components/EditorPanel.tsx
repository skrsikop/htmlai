import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}
const EditorPanel = ({selectedElement, onUpdate, onClose}: EditorPanelProps) => {

    // states 
    const [values, setValues] = useState<NonNullable<EditorPanelProps['selectedElement']> | null>(selectedElement);

    // useEffect
    useEffect(() => {
        setValues(selectedElement);
    }, [selectedElement]);
    // render
    if(!selectedElement || !values) return null;

    // functions \
    // handle change
    const handleChange = (field: string, newValue: string) => {
        if (!values) return;
        // determine if the field is a style key
        const isStyleField = field in values.styles;
        if (isStyleField) {
            const updatedStyles = { ...values.styles, [field]: newValue };
            const newValues = { ...values, styles: updatedStyles };
            setValues(newValues);
            onUpdate({ styles: { [field]: newValue } });
        } else {
            const newValues = { ...values, [field]: newValue } as typeof values;
            setValues(newValues);
            onUpdate({ [field]: newValue });
        }
    };
    // handle style change
    const handleStyleChange = (styleName: string, value: string) => {
        const newStyles = {...values.styles, [styleName]: value};
        setValues({...values, styles: newStyles});
        onUpdate({styles: {[styleName]: value}});
    };

  return (
    <div className="absolute top-4 right-4 w-80 border border-gray-200 p-4 z-50 animate-fade-in fade-in bg-white rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-gray-800">Edit Element</h1>
        <button onClick={onClose} className="p-1 hover:bg-gray-100  rounded-full">
            <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="space-y-4 text-black">
        <div className="">
            <label className="block text-xs font-medium">
                Text Content
            </label>
            <textarea
                value={values.text}
                onChange={(e) => {
                    handleChange(
                        'text',
                        e.target.value
                    )
                }}
                 className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
            />
        </div>
        <div >
            <label className="block text-xs font-medium">
                Class Name
            </label>
            <input
                type="text"
                value={values.className || ''}
                onChange={(e) => {
                    handleChange(
                        'className',
                        e.target.value
                    )
                }}
                className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
                {/* paadding  */}
                <div >
                    <label className="block text-xs font-medium">
                        Padding
                    </label>
                    <input
                        type="text"
                        value={values.styles.padding}
                        onChange={(e) => {
                            handleStyleChange(
                                'padding',
                                e.target.value
                            )
                        }}
                        className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                    />
            </div>
            {/* margin  */}
                <div >
                    <label className="block text-xs font-medium">
                        Margin
                    </label>
                    <input
                        type="text"
                        value={values.styles.margin}
                        onChange={(e) => {
                            handleStyleChange(
                                'margin',
                                e.target.value
                            )
                        }}
                        className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                    />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div >
                    <label className="block text-xs font-medium">
                        Font Size 
                    </label>
                    <input
                        type="text"
                        value={values.styles.fontSize}
                        onChange={(e) => {
                            handleStyleChange(
                                'fontSize',
                                e.target.value
                            )
                        }}
                        className="w-full p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                    />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div >
                    <label className="block text-xs font-medium">
                        Background
                    </label>
                    <div className="flex items-center gap-2 border rounded-md p-1 border-gray-400">
                        <input
                        type="color"
                        value={values.styles.backgroundColor === 'rgba(0, 0, 0, 0)' ? "#fffff" : values.styles.backgroundColor}
                        onChange={(e) => {
                            handleStyleChange(
                                'backgroundColor',
                                e.target.value
                            )
                        }}
                        className="w-6 h-6  cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 truncate">
                        {values.styles.backgroundColor}
                    </span>
                    </div>
            </div>
            <div >
                    <label className="block text-xs font-medium">
                        Text Color
                    </label>
                    <div className="flex items-center gap-2 border rounded-md p-1 border-gray-400">
                        <input
                        type="color"
                        value={values.styles.color}
                        onChange={(e) => {
                            handleStyleChange(
                                'color',
                                e.target.value
                            )
                        }}
                        className="w-6 h-6  cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 truncate">
                        {values.styles.color}
                    </span>
                    </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default EditorPanel
