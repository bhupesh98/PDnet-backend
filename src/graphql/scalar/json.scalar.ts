import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode, print } from 'graphql';

@Scalar('JSON', (type) => Object)
export class JSONScalar implements CustomScalar<string, Object> {
  description = 'JSON custom scalar type';

  parseValue(value: string): Object {
    return JSON.parse(value);
  }

  serialize(value: Object): string {
    return JSON.stringify(value);
  }

  parseLiteral(ast: ValueNode, variables: Record<string,unknown>): Object {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
        return parseInt(ast.value, 10);
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        return ast.fields.reduce((acc, field) => {
          acc[field.name.value] = this.parseLiteral(field.value, variables);
          return acc;
        }, {});
      }
      case Kind.LIST:
        return ast.values.map((n) => this.parseLiteral(n, variables));
      case Kind.NULL:
        return null;
      case Kind.VARIABLE:
        return variables ? variables[ast.name.value] : undefined
      default:
        return new TypeError(`JSON cannot represent value: ${print(ast)}`);
    } 
  }
}
