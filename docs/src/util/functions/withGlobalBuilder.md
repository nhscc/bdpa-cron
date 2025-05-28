[**@nhscc/bdpa-cron**](../../../README.md)

***

[@nhscc/bdpa-cron](../../../README.md) / [src/util](../README.md) / withGlobalBuilder

# Function: withGlobalBuilder()

> **withGlobalBuilder**\<`CustomCliArguments`\>(...`__namedParameters`): `WithBuilderExtensionsReturnType`\<`CustomCliArguments`\>

Defined in: [src/util.ts:18](https://github.com/nhscc/bdpa-cron/blob/fb94d84b32201c9d8dab385121a53d5c0ecc3177/src/util.ts#L18)

A version of withStandardBuilder that expects `CustomCliArguments` to
extend [GlobalCliArguments](../../configure/type-aliases/GlobalCliArguments.md) and implements any related global handler
functionality.

[globalCliArguments](../../configure/variables/globalCliArguments.md) is included in `additionalCommonOptions`
automatically. See withStandardBuilder for more details on how this
function semi-deep merges various common option configurations.

## Type Parameters

### CustomCliArguments

`CustomCliArguments` *extends* [`GlobalCliArguments`](../../configure/type-aliases/GlobalCliArguments.md)

## Parameters

### \_\_namedParameters

...\[`BfeBuilderObject`\<`CustomCliArguments`, `StandardExecutionContext`\> \| (...`args`) => `void` \| `BfeBuilderObject`\<`CustomCliArguments`, `StandardExecutionContext`\>, `Omit`\<`WithBuilderExtensionsConfig`\<`CustomCliArguments`\>, `"commonOptions"` \| `"enableAutomaticSorting"`\> & `object`?\]

## Returns

`WithBuilderExtensionsReturnType`\<`CustomCliArguments`\>
