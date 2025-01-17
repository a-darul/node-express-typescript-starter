// src/shared/custom-eslint-rules/sort-export-default.js
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensure export default object keys are sorted alphabetically.',
        },
        fixable: 'code',
    },
    create(context) {
        return {
            ExportDefaultDeclaration(node) {
                if (node.declaration.type === 'ObjectExpression') {
                    const properties = node.declaration.properties;
                    const keys = properties.map((prop) => prop.key.name);
                    const sortedKeys = [...keys].sort();

                    if (keys.join('') !== sortedKeys.join('')) {
                        context.report({
                            node,
                            message: 'Keys in export default object should be sorted alphabetically.',
                            fix(fixer) {
                                const sortedProps = sortedKeys
                                    .map((key) => properties.find((prop) => prop.key.name === key))
                                    .map((prop) => context.getSourceCode().getText(prop));
                                return fixer.replaceText(node.declaration, `{ ${sortedProps.join(', ')} }`);
                            },
                        });
                    }
                }
            },
        };
    },
};
